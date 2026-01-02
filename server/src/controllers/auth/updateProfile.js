import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });

    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    const data = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (phone !== undefined) data.phone = phone;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (zipCode !== undefined) data.zipCode = zipCode;
    if (country !== undefined) data.country = country;

    const updated = await prisma.user.update({ where: { id: userId }, data });

    // return selected fields
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        role: true,
        provider: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendResponse(res, { message: "Profile updated", data: user });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
