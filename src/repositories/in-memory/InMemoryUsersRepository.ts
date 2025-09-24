import { User } from "@prisma/client";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../UsersRepository";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];

  async register(params: CreateUserAttributes): Promise<Partial<User>> {
    const user = {
      id: "user1",
      name: params.name,
      email: params.email,
      password: params.password,
      createdAt: new Date(),
      bio: "",
      profilePhoto: null,
      updatedAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  searchUsers(params: SearchUsersAttributes): Promise<Partial<User>[]> {
    throw new Error("Method not implemented.");
  }

  count(name: string): Promise<number> {
    throw new Error("Method not implemented.");
  }

  findUserById(id: string): Promise<Partial<User> | null> {
    throw new Error("Method not implemented.");
  }

  async findUserByEmail(
    email: string
  ): Promise<Pick<User, "id" | "name" | "email" | "password"> | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }

  updateUser(id: string, attributes: UpdateUserAttributes): Promise<void> {
    throw new Error("Method not implemented.");
  }

  followUser(followerId: string, userToFollowId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  unfollowUser(followerId: string, userToUnfollowId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
