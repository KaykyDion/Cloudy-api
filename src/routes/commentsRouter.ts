import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { commentsController } from "../container";

export const commentsRouter = Router();

commentsRouter.post(
  "/:postId/comments",
  authMiddleware,
  commentsController.create
);
commentsRouter.put(
  "/:postId/comments/:id",
  authMiddleware,
  commentsController.update
);
commentsRouter.delete(
  "/:postId/comments/:id",
  authMiddleware,
  commentsController.delete
);
