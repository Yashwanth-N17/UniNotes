import { prisma } from "../config/db.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req, res) {
  const { fullname, username, email, password, university, department, year } =
    req.body;

  const isAlreadyRegistered = await prisma.user.findUnique({
    where: {
      email: email,
      username: username,
    },
  });

  if(!fullname || !username || !email || !password || !university || !department || !year){
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isAlreadyRegistered) {
    return res.status(409).json({ message: "User already registered" });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const newUser = await prisma.user.create({
    data: {
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
      university: university,
      department: department,
      year: year,
    },
  });

  const accessToken = jwt.sign(
    {
      id: newUser.id,
    },
    config.jwtSecret,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: newUser.id,
    },
    config.jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      university: newUser.university,
      department: newUser.department,
      year: newUser.year,
    },
    token: accessToken,
  });
}


export async function getMe(req, res){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
    });
    
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            university: user.university,
            department: user.department,
            year: user.year,
        },
    });
}


export async function refreshToken(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(refreshToken, config.jwtSecret);
    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
    });
    
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
        },
        config.jwtSecret,
        {
            expiresIn: "15m",
        },
    );

    const newRefreshToken = jwt.sign(
        {
            id: user.id,
        },
        config.jwtSecret,
        {
            expiresIn: "7d",
        },
    );

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        message: "Refresh token fetched successfully",
        token: accessToken,
    });
}