import * as jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { env } from "../env";
import { UserService } from "./UsersService";
import { HttpError } from "../errors/HttpError";
import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";

interface DecodedUser {
  id: string;
  email: string;
  password: string;
  name: string;
  iat: number;
  exp: number;
}

describe("Users Service", () => {
  it("should register an user and return a jwt token", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(user);

    expect(token).toEqual(expect.any(String));
  });

  it("should not be able to register an user with an email used", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(async () => {
      await usersService.registerUser({
        name: "John Doe 2",
        email: "johndoe@example.com",
        password: "221133",
      });
    }).rejects.toThrow(new HttpError(500, "this email is already in use!"));
  });

  it("should search users", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await usersService.registerUser({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "123456",
    });

    const users = await usersService.searchUsers({ name: "John", page: 0 });

    expect(users.meta).toEqual({ page: 0, total: 1 });
  });

  it("should login an user and return a jwt token", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    await usersService.registerUser(user);

    const token = await usersService.login(user.email, user.password);

    expect(token).toEqual(expect.any(String));
  });

  it("should throw an error when send an incorret email on login", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    await expect(async () => {
      await usersService.login("johndoe@example.com", "221133");
    }).rejects.toThrow(new HttpError(500, "incorrect email or password!"));
  });

  it("should throw an error when send an incorret password on login", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    await usersService.registerUser(user);

    await expect(async () => {
      await usersService.login("johndoe@example.com", "123131");
    }).rejects.toThrow(new HttpError(500, "incorrect email or password!"));
  });

  it("should find a user by id", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(userData);

    const decodedUser = jwt.verify(token, env.SECRET_KEY) as DecodedUser;

    const user = await usersService.findUserById(decodedUser.id);

    expect(user.email).toEqual(userData.email);
  });

  it("should throw an error where not found user by id", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    await expect(async () => {
      await usersService.findUserById("2132131-12313-23113-21");
    }).rejects.toThrow(new HttpError(404, "User not found!"));
  });

  it("should update an user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(userData);

    const decodedUser = jwt.verify(token, env.SECRET_KEY) as DecodedUser;

    await usersService.updateUser(decodedUser.id, decodedUser, {
      name: "Kenzo Titanium",
      bio: "Hello World!",
    });

    const updatedUser = await usersService.findUserById(decodedUser.id);

    expect({ name: updatedUser.name, bio: updatedUser.bio }).toEqual({
      name: "Kenzo Titanium",
      bio: "Hello World!",
    });
  });

  it("should throw an error where not found an user to update", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(userData);

    const decodedUser = jwt.verify(token, env.SECRET_KEY) as DecodedUser;

    await expect(async () => {
      await usersService.updateUser("312313-1331-23131-1323", decodedUser, {
        name: "Kenzo Titanium",
        bio: "Hello World!",
      });
    }).rejects.toThrow(new HttpError(404, "User not found!"));
  });

  it("should follow an user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const token1 = await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const token2 = await usersService.registerUser({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "123456",
    });

    const decodedUser1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;
    const decodedUser2 = jwt.verify(token2, env.SECRET_KEY) as DecodedUser;

    const user1 = (await usersService.findUserById(
      decodedUser1.id
    )) as DecodedUser;
    const user2 = await usersService.findUserById(decodedUser2.id);

    const message = await usersService.followUser(user1, decodedUser2.id);

    expect(message).toEqual(
      `User ${user2.name} successfully followed by ${user1.name}`
    );
  });

  it("should throw an error when the user to follow is not found", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const token1 = await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const decodedUser1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;

    const user1 = (await usersService.findUserById(
      decodedUser1.id
    )) as DecodedUser;

    await expect(async () => {
      await usersService.followUser(user1, "83198321-31231-12313-213");
    }).rejects.toThrow(new HttpError(404, "User not found!"));
  });

  it("should unfollow an user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const token1 = await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const token2 = await usersService.registerUser({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "123456",
    });

    const decodedUser1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;
    const decodedUser2 = jwt.verify(token2, env.SECRET_KEY) as DecodedUser;

    const user1 = (await usersService.findUserById(
      decodedUser1.id
    )) as DecodedUser;
    const user2 = await usersService.findUserById(decodedUser2.id);

    await usersService.followUser(user1, decodedUser2.id);

    const message = await usersService.unfollowUser(user1, decodedUser2.id);

    expect(message).toEqual(`${user1.name} unfollowed ${user2.name}`);
  });

  it("should throw an error when the user to unfollow is not found", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const token1 = await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const decodedUser1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;

    const user1 = (await usersService.findUserById(
      decodedUser1.id
    )) as DecodedUser;

    await expect(async () => {
      await usersService.unfollowUser(user1, "83198321-31231-12313-213");
    }).rejects.toThrow(new HttpError(404, "User not found!"));
  });

  it("should throw an error where an user tries to update another user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const token1 = await usersService.registerUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const token2 = await usersService.registerUser({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "123456",
    });

    const decodedUser1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;
    const decodedUser2 = jwt.verify(token2, env.SECRET_KEY) as DecodedUser;

    await expect(async () => {
      await usersService.updateUser(decodedUser1.id, decodedUser2, {
        name: "Kenzo Titanium",
        bio: "Hello World!",
      });
    }).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!")
    );
  });

  it("should delete an user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(userData);

    const decodedUser = jwt.verify(token, env.SECRET_KEY) as DecodedUser;

    await usersService.deleteUser(decodedUser.id, decodedUser);

    await expect(async () => {
      await usersService.findUserById(decodedUser.id);
    }).rejects.toThrow("User not found!");
  });

  it("should throw an error where not found user by id on delete user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const token = await usersService.registerUser(userData);

    const decodedUser = jwt.verify(token, env.SECRET_KEY) as DecodedUser;

    await expect(async () => {
      await usersService.deleteUser("2132131-12313-23113-21", decodedUser);
    }).rejects.toThrow(new HttpError(404, "User not found!"));
  });

  it("should throw an error when a user tries to delete another user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const usersService = new UserService(usersRepository);

    const userData1 = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const userData2 = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "4324242",
    };

    const token1 = await usersService.registerUser(userData1);
    const token2 = await usersService.registerUser(userData2);

    const user1 = jwt.verify(token1, env.SECRET_KEY) as DecodedUser;
    const user2 = jwt.verify(token2, env.SECRET_KEY) as DecodedUser;

    await expect(async () => {
      await usersService.deleteUser(user1.id, user2);
    }).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!")
    );
  });
});
