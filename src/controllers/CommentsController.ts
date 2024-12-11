import { Handler } from "express";
import { CommentsService } from "../services/CommentsService";
import { CreatePostRequestSchema } from "./schemas/PostRequestSchema";

export class CommentsController {
  constructor(private readonly commentsServices: CommentsService) {}

  create: Handler = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const ownerId = req.authenticatedUser.id;
      const { content } = CreatePostRequestSchema.parse(req.body);
      const comment = await this.commentsServices.createComment({
        postId,
        ownerId,
        content,
      });
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const userId = req.authenticatedUser.id;
      const { content } = CreatePostRequestSchema.parse(req.body);
      const updatedComment = await this.commentsServices.updateComment(
        commentId,
        content,
        userId
      );
      res.json({ updatedComment });
    } catch (error) {
      next(error);
    }
  };

  like: Handler = async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const authenicatedUser = req.authenticatedUser;
      const message = await this.commentsServices.likeComment(
        commentId,
        authenicatedUser
      );
      res.json({ message });
    } catch (error) {
      next(error);
    }
  };

  deleteLike: Handler = async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const authenicatedUser = req.authenticatedUser;
      const message = await this.commentsServices.removeLikeFromComment(
        commentId,
        authenicatedUser
      );
      res.json({ message });
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const commentId = req.params.id;
      const userId = req.authenticatedUser.id;
      const deletedComment = await this.commentsServices.deleteComment(
        commentId,
        userId
      );
      res.json({ deletedComment });
    } catch (error) {
      next(error);
    }
  };
}
