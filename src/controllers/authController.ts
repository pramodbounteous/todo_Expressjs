import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { Auth } from "../models/authModel";
import { signupSchema, loginSchema, refreshTokenSchema } from "../validations/authValidation";
import { Types } from "mongoose";

const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7; // 7 days

// Helper: generate access token
const generateAccessToken = (userId: Types.ObjectId, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Helper: generate refresh token
const generateRefreshToken = (userId: Types.ObjectId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d` }
  );
};

// Signup controller
export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    // check if username exists
    const existingUser = await User.findOne({ username: validatedData.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // create user
    const user = await User.create({
      username: validatedData.username,
      password: hashedPassword,
    });

    // generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    await Auth.create({
      user: user._id,
      refreshToken,
      expiresAt,
    });

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ username: validatedData.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    await Auth.create({
      user: user._id,
      refreshToken,
      expiresAt,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Refresh token controller
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // check DB
    const storedToken = await Auth.findOne({ refreshToken });
    if (!storedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // verify token
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

    // generate new access token
    const accessToken = generateAccessToken(decoded.userId, (await User.findById(decoded.userId))?.role || "user");

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    await Auth.findOneAndDelete({ refreshToken });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};