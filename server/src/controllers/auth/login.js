import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const prisma = new PrismaClient();

export const manualLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🚫 Google-only account
    if (user.provider === "GOOGLE" && !user.password) {
      return res.status(403).json({
        message: "Please login using Google",
        code: "GOOGLE_ACCOUNT",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // await prisma.session.create({
    //   data: {
    //     userId: user.id,
    //     refreshToken,
    //     ipAddress: req.ip,
    //     userAgent: req.headers["user-agent"],
    //   },
    // });

    return res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        id: user.id,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Manual login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
