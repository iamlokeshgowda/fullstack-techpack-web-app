import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Authorization token missing",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      // 🔐 Role check
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};
