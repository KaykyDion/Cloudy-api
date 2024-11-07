import { User } from "@prisma/client";
import {
  CreateUserAttributes,
  SearchUsersAttributes,
  UpdateUserAttributes,
  UserRepository,
} from "../UsersRepository";
import { prisma } from "../../database";

export class PrismaUsersRepository implements UserRepository {
  async register(params: CreateUserAttributes): Promise<User> {
    return await prisma.user.create({
      data: params,
    });
  }

  async searchUsers(params: SearchUsersAttributes): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        name: { contains: params.name, mode: "insensitive" },
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });
  }

  async count(name: string): Promise<number> {
    return await prisma.user.count({ where: { name: { contains: name } } });
  }

  async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { Posts: true },
    });
  }

  async updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data: attributes,
    });
  }

  async deleteUser(id: string): Promise<User | null> {
    return await prisma.user.delete({ where: { id } });
  }
}
