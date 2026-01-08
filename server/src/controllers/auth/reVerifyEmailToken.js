import { PrismaClient } from "@prisma/client";
import { generateEmailVerificationToken } from "../../utils/jwt.js";
import { sendVerificationEmail } from "../../utils/email.js";

const prisma = new PrismaClient();

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({
        message: "If account doesn't exists, verification email won't be sent",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    const newToken = generateEmailVerificationToken(user.id);

    await prisma.emailToken.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: "VERIFY_EMAIL",
        },
      },
      update: {
        token: newToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        used: false,
      },
      create: {
        token: newToken,
        userId: user.id,
        type: "VERIFY_EMAIL",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${newToken}`;

    await sendVerificationEmail(user.email, verifyUrl);

    return res.json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Unable to resend verification email",
    });
  }
};
