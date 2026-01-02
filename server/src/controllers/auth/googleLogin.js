import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing Google token" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      email,
      name,
      email_verified,
      given_name: firstName,
      family_name: lastName,
      sub: googleId,
    } = payload;

    if (!email_verified) {
      return res.status(403).json({ message: "Google email not verified" });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    // 🔁 LINK LOCAL → GOOGLE
    if (user && user.provider === "LOCAL") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: "GOOGLE",
          googleId,
          isEmailVerified: true,
        },
      });
    }

    // 🆕 CREATE GOOGLE USER
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          provider: "GOOGLE",
          isEmailVerified: true,
          firstName,
          lastName,
        },
      });
    }

    // 🚫 BLOCK mismatched Google account
    if (user.googleId && user.googleId !== googleId) {
      return res.status(403).json({
        message: "Google account mismatch",
      });
    }

    // 🔐 Issue tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

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
    console.error("Google login error:", err);
    return res.status(401).json({
      message: "Invalid Google token",
    });
  }
};
