import { User } from "@prisma/client";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../UsersRepository";
import { prisma } from "../../database";

const selectUserInfos = {
  id: true,
  name: true,
  email: true,
  bio: true,
  profilePhoto: true,
  createdAt: true,
  updatedAt: true,
};

export class PrismaUsersRepository implements UserRepository {
  async register(params: CreateUserAttributes): Promise<Partial<User>> {
    return await prisma.user.create({
      data: params,
      select: selectUserInfos,
    });
  }

  async searchUsers(params: SearchUsersAttributes): Promise<Partial<User>[]> {
    return await prisma.user.findMany({
      where: {
        name: { contains: params.name, mode: "insensitive" },
      },
      select: selectUserInfos,
      take: 20,
      skip: (params.page - 1) * 20,
    });
  }

  async count(name: string): Promise<number> {
    return await prisma.user.count({ where: { name: { contains: name } } });
  }

  async findUserById(id: string): Promise<Partial<User> | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        ...selectUserInfos,
        posts: true,
        followers: { include: { follower: { select: { name: true } } } },
        following: { include: { following: { select: { name: true } } } },
      },
    });
  }

  async findUserByEmail(
    email: string
  ): Promise<Pick<User, "id" | "name" | "email" | "password"> | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
  }

  async updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: attributes,
    });
  }

  async followUser(followerId: string, userToFollowId: string): Promise<void> {
    await prisma.follower.create({
      data: {
        followerId,
        followingId: userToFollowId,
      },
    });
  }

  async unfollowUser(
    followerId: string,
    userToUnfollowId: string
  ): Promise<void> {
    await prisma.follower.delete({
      where: {
        followerId_followingId: { followerId, followingId: userToUnfollowId },
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
