import { Handler } from "express";
import { UserService } from "../services/UsersService";
import {
  CreateUserRequestSchema,
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
      const user = await this.userService.registerUser({
        name,
        email,
        password,
      });
      res.status(201).json(user);
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
      const { bio, profilePhoto } = UpdateUserRequestSchema.parse(req.body);
      const updatedUser = await this.userService.updateUser(id, {
        bio,
        profilePhoto,
      });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedUser = await this.userService.deleteUser(id);
      res.json({ deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
