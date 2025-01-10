import { Handler } from "express";
import { PostsService } from "../services/PostsService";
import {
  SearchPostRequestSchema,
  CreatePostRequestSchema,
} from "./schemas/PostRequestSchema";

export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const { page = 1, text = "" } = SearchPostRequestSchema.parse(req.query);
      const result = await this.postsService.searchPosts(page, text);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const post = await this.postsService.findPostById(id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const authenticatedUser = req.authenticatedUser;
      const { content } = CreatePostRequestSchema.parse(req.body);
      const post = await this.postsService.createPost(
        authenticatedUser,
        content
      );
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { content } = CreatePostRequestSchema.parse(req.body);
      const authenticatedUser = req.authenticatedUser;
      const updatedPost = await this.postsService.editPost(
        id,
        content,
        authenticatedUser
      );
      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  like: Handler = async (req, res, next) => {
    try {
      const postId = req.params.id;
      const authenticatedUser = req.authenticatedUser;
      const message = await this.postsService.likePost(
        authenticatedUser.id,
        postId
      );
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  deleteLike: Handler = async (req, res, next) => {
    try {
      const postId = req.params.id;
      const authenticatedUser = req.authenticatedUser;
      const message = await this.postsService.removeLikeFromPost(
        authenticatedUser.id,
        postId
      );
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const authenticatedUser = req.authenticatedUser;
      const deletedPostMessage = await this.postsService.deletePost(
        id,
        authenticatedUser
      );
      res.json({ deletedPostMessage });
    } catch (error) {
      next(error);
    }
  };
}
