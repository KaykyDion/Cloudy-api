import { hashSync, compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../errors/HttpError";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../repositories/UsersRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(attributes: CreateUserAttributes) {
    const { name, email, password } = attributes;
    if (password.length < 8)
      throw new HttpError(500, "Password must be at least 8 characters long!");
    if (name.length < 3)
      throw new HttpError(500, "Username must be at least 3 characters long!");
    return await this.userRepository.register({
      name,
      email,
      password: hashSync(password, 10),
    });
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

  async updateUser(id: string, attributes: UpdateUserAttributes) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new HttpError(404, "User not found!");
    return this.userRepository.updateUser(id, attributes);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new HttpError(404, "User not found!");
    return await this.userRepository.deleteUser(id);
  }
}
