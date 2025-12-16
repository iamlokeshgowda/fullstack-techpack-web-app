import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { response } from "express";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if(existingUser){
        return res.status(409).json({message:"User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })

      return res.status(201).json({
      message: "User registered successfully",
      userId: user.id
    });

  } catch (error) {
     console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
