import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const generateEmailVerificationToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.EMAIL_VERIFY_SECRET
    // {expiresIn:"24h"}
  );
};
