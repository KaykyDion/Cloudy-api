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
  name?: string
}

export interface UserRepository {
  register(params: CreateUserAttributes): Promise<Partial<User>>;

  searchUsers(params: SearchUsersAttributes): Promise<Partial<User>[]>;

  count(name: string): Promise<number>;

  findUserById(id: string): Promise<Partial<User> | null>;

  findUserByEmail(
    email: string
  ): Promise<Pick<User, "id" | "name" | "email" | "password"> | null>;

  updateUser(id: string, attributes: UpdateUserAttributes): Promise<void>;

  followUser(followerId: string, userToFollowId: string): Promise<void>;

  unfollowUser(followerId: string, userToUnfollowId: string): Promise<void>;

  deleteUser(id: string): Promise<void>;
}
