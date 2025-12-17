import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const existingToken = await prisma.emailToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    if (existingToken.used) {
      return res.status(400).json({
        message: "Token already used",
      });
    }

    if (existingToken.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Verification token expired",
      });
    }

    await prisma.user.update({
      where: { id: existingToken.userId },
      data: { isEmailVerified: true },
    });

    await prisma.emailToken.update({
      where: { token },
      data: { used: true },
    });

    return res.status(200).json({
      message: "Your email has been verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({
      message: "Error verifying email",
    });
  }
};
