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
    if (attributes.password.length < 8)
      throw new HttpError(500, "Password must be at least 8 characters long!");
    if (attributes.name.length < 3)
      throw new HttpError(500, "Username must be at least 3 characters long!");
    return await this.userRepository.register(attributes);
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
