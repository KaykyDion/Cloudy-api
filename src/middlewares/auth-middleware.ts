import { Handler } from "express";
import * as jwt from "jsonwebtoken";
import { PrismaUsersRepository } from "../repositories/prisma/PrismaUsersRepository";
import { HttpError } from "../errors/HttpError";

const secretKey = process.env.SECRET_KEY;
const UserRepository = new PrismaUsersRepository();

interface DecodedUser {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const authMiddleware: Handler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization)
      throw new HttpError(401, "The authorization token is required!");
    const token = authorization.split(" ")[1];

    const decodedUser = jwt.verify(token, secretKey) as DecodedUser;
    const user = await UserRepository.findUserByEmail(decodedUser.email);
    if (!user) throw new HttpError(404, "User not found!");
    req.authenticatedUser = user;
  } catch (error) {
    next(error);
  }
  next();
};
