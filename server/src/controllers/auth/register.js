import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
} from "../../utils/jwt.js";
import { sendVerificationEmail } from "../../utils/email.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create verification token
    const token = generateEmailVerificationToken(user.id);
    await prisma.emailToken.create({
      data: {
        token,
        userId: user.id,
        type: "VERIFY_EMAIL",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendVerificationEmail(email, verifyUrl);

    return res.status(201).json({
      message: "Registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
