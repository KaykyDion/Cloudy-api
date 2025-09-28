import { Follower, User } from "@prisma/client";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../UsersRepository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];
  public usersFollowers: Follower[] = [];

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

  async searchUsers({
    name,
    page,
  }: SearchUsersAttributes): Promise<Partial<User>[]> {
    const users = this.users.filter((user) => {
      return user.name.toLowerCase().includes(name.toLowerCase());
    });

    return users.slice(page * 20, page * 20 + 20);
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

    if (userToUpdateIndex !== -1) {
      this.users[userToUpdateIndex] = {
        ...this.users[userToUpdateIndex],
        ...attributes,
      };
    }
  }

  async followUser(followerId: string, userToFollowId: string): Promise<void> {
    this.usersFollowers.push({
      followerId,
      followingId: userToFollowId,
      createdAt: new Date(),
    });

    return;
  }

  async unfollowUser(
    followerId: string,
    userToUnfollowId: string
  ): Promise<void> {
    const filteredFollowers = this.usersFollowers.filter((follower) => {
      return (
        follower.followerId !== followerId &&
        follower.followingId !== userToUnfollowId
      );
    });

    this.usersFollowers = filteredFollowers;
  }

  async deleteUser(id: string): Promise<void> {
    const filteredUsers = this.users.filter((user) => user.id !== id);
    this.users = filteredUsers;
  }
}
