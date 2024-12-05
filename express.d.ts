import { User } from "@prisma/client";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser: Pick<User, "id" | "email" | "password">;
    }
  }
}
