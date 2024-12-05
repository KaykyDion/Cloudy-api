import { UsersController } from "./controllers/UsersController";
import { PrismaUsersRepository } from "./repositories/prisma/PrismaUsersRepository";
import { UserService } from "./services/UsersService";

import { PostsController } from "./controllers/PostsController";
import { PrismaPostsRepository } from "./repositories/prisma/PrismaPostsRepository";
import { PostsService } from "./services/PostsService";

const usersRepository = new PrismaUsersRepository();
const usersService = new UserService(usersRepository);
export const usersController = new UsersController(usersService);

const postsRepository = new PrismaPostsRepository();
const postsService = new PostsService(postsRepository);
export const postsController = new PostsController(postsService);
