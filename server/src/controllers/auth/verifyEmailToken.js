import { PrismaClient } from "@prisma/client";
import { resendVerificationToken } from "../../utils/resendVerificationToken.js";
const prisma = new PrismaClient();

export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    let tokenResent = false;

    await prisma.$transaction(async (tx) => {
      const emailToken = await tx.emailToken.findUnique({
        where: { token },
      });

      if (!emailToken) throw new Error("INVALID_TOKEN");
      if (emailToken.used) throw new Error("ALREADY_VERIFIED");

      if (emailToken.expiresAt < new Date()) {
        await resendVerificationToken(tx, emailToken.userId);
        tokenResent = true;
        return;
      }

      await tx.emailToken.update({
        where: { token },
        data: { used: true },
      });

      await tx.user.update({
        where: { id: emailToken.userId },
        data: { isEmailVerified: true },
      });
    });

    if (tokenResent) {
      return res.status(400).json({
        message:
          "Verification link expired. A new verification email has been sent.",
      });
    }

    return res.status(200).json({
      message: "Your email has been verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error.message);

    if (error.message === "ALREADY_VERIFIED") {
      return res.status(200).json({
        message: "Email already verified",
      });
    }

    if (error.message === "TOKEN_EXPIRED_RESENT") {
      return res.status(400).json({
        message:
          "Verification link expired. A new verification email has been sent.",
      });
    }

    if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({
        message: "Invalid verification link",
      });
    }

    return res.status(500).json({
      message: "Error verifying email",
    });
  }
};
