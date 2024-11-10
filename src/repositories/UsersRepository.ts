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
  register(params: CreateUserAttributes): Promise<Partial<User>>;

  searchUsers(params: SearchUsersAttributes): Promise<Partial<User>[]>;

  count(name: string): Promise<number>;

  findUserById(id: string): Promise<Partial<User> | null>;

  updateUser(
    id: string,
    attributes: UpdateUserAttributes
  ): Promise<string | null>;

  deleteUser(id: string): Promise<string | null>;
}
