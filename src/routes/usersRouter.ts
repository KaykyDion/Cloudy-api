import { Router } from "express";
import { usersController } from "../container";
import { authMiddleware } from "../middlewares/auth-middleware";

export const usersRouter = Router();

usersRouter.get("/", authMiddleware, usersController.index);
usersRouter.get("/login", usersController.login);
usersRouter.get("/:id", authMiddleware, usersController.show);
usersRouter.post("/register", usersController.create);
usersRouter.put("/:id", authMiddleware, usersController.update);
usersRouter.post("/:id/followers", authMiddleware, usersController.follow);
usersRouter.delete("/:id/followers", authMiddleware, usersController.unfollow);
usersRouter.delete("/:id", authMiddleware, usersController.delete);
