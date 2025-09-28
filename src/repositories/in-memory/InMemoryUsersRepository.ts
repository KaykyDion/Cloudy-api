import { User } from "@prisma/client";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../UsersRepository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];

  async register(params: CreateUserAttributes): Promise<Partial<User>> {
    const user = {
      id: randomUUID(),
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

  async searchUsers(params: SearchUsersAttributes): Promise<Partial<User>[]> {
    const users = this.users.filter((user) => {
      return user.name.toLowerCase().includes(params.name.toLowerCase());
    });

    return users;
  }

  async count(name: string): Promise<number> {
    const usersCount = this.users.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    ).length;

    return usersCount;
  }

  async findUserById(id: string): Promise<Partial<User> | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByEmail(
    email: string
  ): Promise<Pick<User, "id" | "name" | "email" | "password"> | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }

  async updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<void> {
    const userToUpdateIndex = this.users.findIndex((user) => user.id === id);

    if (userToUpdateIndex === -1) {
      throw new Error("User to update not found!");
    }

    this.users[userToUpdateIndex] = {
      ...this.users[userToUpdateIndex],
      ...attributes,
    };
  }

  followUser(followerId: string, userToFollowId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  unfollowUser(followerId: string, userToUnfollowId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteUser(id: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id);
    this.users = filteredUsers;
  }
}
