import { generateEmailVerificationToken } from "./jwt.js";
import { sendVerificationEmail } from "./email.js";

export const resendVerificationToken = async (tx, userId) => {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user?.email) {
    throw new Error("USER_EMAIL_NOT_FOUND");
  }

  const newToken = generateEmailVerificationToken(userId);
  console.log("newToken....", newToken);

  await tx.emailToken.upsert({
    where: {
      userId_type: {
        userId,
        type: "VERIFY_EMAIL",
      },
    },
    update: {
      token: newToken,
      used: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    create: {
      userId,
      type: "VERIFY_EMAIL",
      token: newToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${newToken}`;
  await sendVerificationEmail(user.email, verifyUrl);
};
