import { User } from "@prisma/client";

export interface CreateUserAttributes {
  name: string;
  email: string;
  password: string;
}

export interface SearchUsersAttributes {
  name: string;
  page: number;
}

export interface UpdateUserAttributes {
  bio?: string;
  profilePhoto?: string;
}

export interface UserRepository {
  register(params: CreateUserAttributes): Promise<User>;

  searchUsers(params: SearchUsersAttributes): Promise<User[]>;

  count(name: string): Promise<number>;

  findUserById(id: string): Promise<User | null>;

  updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<User | null>;

  deleteUser(id: string): Promise<User | null>;
}
