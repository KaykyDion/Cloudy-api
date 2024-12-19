import { Handler } from "express";
import { UserService } from "../services/UsersService";
import {
  CreateUserRequestSchema,
  LoginUserRequestSchema,
  SearchUserRequestSchema,
  UpdateUserRequestSchema,
} from "./schemas/UserRequestSchema";

export class UsersController {
  constructor(private readonly userService: UserService) {}

  index: Handler = async (req, res, next) => {
    try {
      const { name, page = 1 } = SearchUserRequestSchema.parse(req.query);
      const users = await this.userService.searchUsers({ name, page });
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const { name, email, password } = CreateUserRequestSchema.parse(req.body);
      const token = await this.userService.registerUser({
        name,
        email,
        password,
      });
      res.status(201).json(token);
    } catch (error) {
      next(error);
    }
  };

  login: Handler = async (req, res, next) => {
    try {
      const { email, password } = LoginUserRequestSchema.parse(req.body);
      const token = await this.userService.login(email, password);
      res.json(token);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await this.userService.findUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const authenticatedUser = req.authenticatedUser;
      const { bio, profilePhoto } = UpdateUserRequestSchema.parse(req.body);
      const updateUserMessage = await this.userService.updateUser(
        id,
        authenticatedUser,
        { bio, profilePhoto }
      );
      res.json({ message: updateUserMessage });
    } catch (error) {
      next(error);
    }
  };

  follow: Handler = async (req, res, next) => {
    try {
      const authenticatedUser = req.authenticatedUser;
      const id = req.params.id;
      const message = await this.userService.followUser(authenticatedUser, id);
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  unfollow: Handler = async (req, res, next) => {
    try {
      const authenticatedUser = req.authenticatedUser;
      const id = req.params.id;
      const message = await this.userService.unfollowUser(
        authenticatedUser,
        id
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
      const deletedUser = await this.userService.deleteUser(
        id,
        authenticatedUser
      );
      res.json({ message: deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
