import { prisma } from "../config/db.js";
import { hashData, hashPassword, comparePassword, compareData } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.js";

export async function registerUser(data, { ip, headers }) {
  const { fullname, username, email, password, university, department, year } = data;

  if (!fullname || !username || !email || !password || !university || !department || !year) {
    throw new Error("Missing required registration fields");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("Email or username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword,
      university,
      department,
      year,
      stats: {
        create: {}
      }
    },
  });

  const refreshToken = generateRefreshToken({ id: user.id });
  const refreshTokenHash = await hashData(refreshToken);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ip,
      userAgent: headers["user-agent"],
      revoke: false,
    },
  });

  const accessToken = generateAccessToken({
    id: user.id,
    sessionId: session.id,
  });

  return { user, accessToken, refreshToken };
}

export async function loginUser(email, password, { ip, headers }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const refreshToken = generateRefreshToken({ id: user.id });
  const refreshTokenHash = await hashData(refreshToken);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ip,
      userAgent: headers["user-agent"],
      revoke: false,
    },
  });

  const accessToken = generateAccessToken({
    id: user.id,
    sessionId: session.id,
  });

  return { accessToken, refreshToken };
}

export async function refreshUserToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Session expired or invalid refresh token");
  }

  const decoded = verifyToken(refreshToken);
  
  const sessions = await prisma.session.findMany({
    where: {
      userId: decoded.id,
      revoke: false,
    },
  });

  let session = null;
  for (const s of sessions) {
    if (await compareData(refreshToken, s.refreshTokenHash)) {
      session = s;
      break;
    }
  }

  if (!session) {
    throw new Error("Invalid session");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("User record not found");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    sessionId: session.id,
  });

  const newRefreshToken = generateRefreshToken({ id: user.id });
  const newRefreshTokenHash = await hashData(newRefreshToken);

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: newRefreshTokenHash },
  });

  return { accessToken, newRefreshToken };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    throw new Error("Already logged out or session not found");
  }

  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    throw new Error("Session invalid");
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: decoded.id,
      revoke: false,
    },
  });

  let session = null;
  for (const s of sessions) {
    if (await compareData(refreshToken, s.refreshTokenHash)) {
      session = s;
      break;
    }
  }

  if (!session) {
    throw new Error("Session not found");
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { revoke: true },
  });

  return true;
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        bio: true,
        university: true,
        department: true,
        year: true,
        stats: true,
    }
  });

  if (!user) {
    throw new Error("User profile not found");
  }

  if (!user.stats) {
    user.stats = {
      totalUploads: 0,
      totalDownloads: 0,
      totalViews: 0,
      totalBookmarks: 0,
      averageRating: 0.0,
      totalReviews: 0,
      rank: 0,
      achievements: []
    };
  }

  return user;
}

export async function updateUserProfile(userId, data) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData = {};
  const allowedFields = ['fullname', 'username', 'email', 'bio', 'university', 'department', 'year'];
  
  allowedFields.forEach(field => {
      if (data[field] !== undefined) {
          updateData[field] = data[field];
      }
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        bio: true,
        university: true,
        department: true,
        year: true
    }
  });

  return updatedUser;
}



