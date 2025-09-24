import { describe, expect, it } from "vitest";
import { UserService } from "./UsersService";
import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { HttpError } from "../errors/HttpError";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

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

    expect(async () => {
      await usersService.registerUser({
        name: "John Doe 2",
        email: "johndoe@example.com",
        password: "221133",
      });
    }).rejects.toThrow(new HttpError(500, "this email is already in use!"));
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

    expect(async () => {
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

    expect(async () => {
      await usersService.login("johndoe@example.com", "123131");
    }).rejects.toThrow(new HttpError(500, "incorrect email or password!"));
  });
});
