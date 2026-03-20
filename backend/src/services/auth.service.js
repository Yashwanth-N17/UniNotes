import { prisma } from "../config/db.js";
import { hashData, hashPassword, comparePassword, compareData } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.js";

export async function registerUser(data, req) {
  const { fullname, username, email, password, university, department, year } =
    data;

  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    !university ||
    !department ||
    !year
  ) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("User already registered");
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
    },
  });

  const refreshToken = generateRefreshToken({ id: user.id });
  const refreshTokenHash = await hashData(refreshToken);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      revoke: false,
    },
  });

  const accessToken = generateAccessToken({
    id: user.id,
    sessionId: session.id,
  });

  return { user, accessToken, refreshToken };
}

export async function loginUser(email, password, req) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const refreshToken = generateRefreshToken({ id: user.id });
  const refreshTokenHash = await hashData(refreshToken);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
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
    throw new Error("Refresh token not found");
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
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("User not found");
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
    throw new Error("Refresh token not found");
  }

  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid refresh token session");
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
    throw new Error("Invalid refresh token");
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { revoke: true },
  });

  return true;
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      bio: data.bio,
      university: data.university,
      department: data.department,
      year: data.year,
    },
  });

  return updatedUser;
}


