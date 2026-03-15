import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}