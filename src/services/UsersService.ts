import { hashSync, compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../errors/HttpError";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../repositories/UsersRepository";
import { AuthenticatedUser } from "./PostsService";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(attributes: CreateUserAttributes) {
    const { name, email, password } = attributes;
    const emailAlreadyUsed = await this.userRepository.findUserByEmail(email);
    if (emailAlreadyUsed)
      throw new HttpError(500, "this email is already in use!");
    const user = await this.userRepository.register({
      name,
      email,
      password: hashSync(password, 10),
    });
    const userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )
    return userToken
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new HttpError(500, "incorrect email or password!");
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword)
      throw new HttpError(500, "incorrect email or password!");

    const userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    return userToken;
  }

  async searchUsers(params: SearchUsersAttributes) {
    const { name, page } = params;
    const users = await this.userRepository.searchUsers({ name, page });
    const total = await this.userRepository.count(name);
    return { users, meta: { page, total } };
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new HttpError(404, "User not found!");
    return user;
  }

  async updateUser(
    id: string,
    authenticatedUser: AuthenticatedUser,
    attributes: UpdateUserAttributes
  ) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new HttpError(404, "User not found!");
    if (user.id !== authenticatedUser.id)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    await this.userRepository.updateUser(id, attributes);
    return `User ${authenticatedUser.name} successfully updated!`;
  }

  async followUser(
    authenticatedUser: AuthenticatedUser,
    userToFollowId: string
  ) {
    const userToFollow = await this.userRepository.findUserById(userToFollowId);
    if (!userToFollow) throw new HttpError(404, "User not found!");
    await this.userRepository.followUser(authenticatedUser.id, userToFollowId);
    return `User ${userToFollow.name} successfully followed by ${authenticatedUser.name}`;
  }

  async unfollowUser(
    authenticatedUser: AuthenticatedUser,
    userToUnfollowId: string
  ) {
    const userToUnfollow = await this.userRepository.findUserById(
      userToUnfollowId
    );
    if (!userToUnfollow) throw new HttpError(404, "User not found!");
    await this.userRepository.unfollowUser(
      authenticatedUser.id,
      userToUnfollowId
    );
    return `${authenticatedUser.name} unfollowed ${userToUnfollow.name}`;
  }

  async deleteUser(id: string, authenticatedUser: AuthenticatedUser) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new HttpError(404, "User not found!");
    if (user.id !== authenticatedUser.id)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    await this.userRepository.deleteUser(id);
    return `User ${user.name} successfully deleted!`;
  }
}
