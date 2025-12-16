import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, verifyUrl) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Techpack App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};
