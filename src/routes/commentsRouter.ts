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
commentsRouter.post(
  "/:postId/comments/:id/likes",
  authMiddleware,
  commentsController.like
);
commentsRouter.delete(
  "/:postId/comments/:id/likes",
  authMiddleware,
  commentsController.deleteLike
);
commentsRouter.delete(
  "/:postId/comments/:id",
  authMiddleware,
  commentsController.delete
);
