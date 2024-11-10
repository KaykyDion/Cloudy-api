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
      select: { ...selectUserInfos, Posts: true },
    });
  }

  async updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<string | null> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: attributes,
    });
    if (!updatedUser) return null;
    return "User succefully updated!";
  }

  async deleteUser(id: string): Promise<string | null> {
    const deletedUser = await prisma.user.delete({ where: { id } });
    if (!deletedUser) return null;
    return "User succefully deleted!";
  }
}
