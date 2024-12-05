import { Router } from "express";
import { postsController } from "../container";
import { authMiddleware } from "../middlewares/auth-middleware";

export const postsRouter = Router();

postsRouter.get("/", authMiddleware, postsController.index);
postsRouter.post("/", authMiddleware, postsController.create);
postsRouter.get("/:id", authMiddleware, postsController.show);
postsRouter.put("/:id", authMiddleware, postsController.update);
postsRouter.delete("/:id", authMiddleware, postsController.delete);
postsRouter.post("/:id/likes", authMiddleware, postsController.like);
postsRouter.delete("/:id/likes", authMiddleware, postsController.deleteLike);
