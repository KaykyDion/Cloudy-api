import { Router } from "express";
import { usersController } from "../container";

export const usersRouter = Router();

usersRouter.get("/", usersController.index);
usersRouter.get("/login", usersController.login);
usersRouter.get("/:id", usersController.show);
usersRouter.post("/", usersController.create);
usersRouter.put("/:id", usersController.update);
usersRouter.delete("/:id", usersController.delete);
