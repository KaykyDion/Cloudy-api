import { PrismaUsersRepository } from "./repositories/prisma/PrismaUsersRepository";
import { UserService } from "./services/UsersService";
import { UsersController } from "./controllers/UsersController";

import { PrismaPostsRepository } from "./repositories/prisma/PrismaPostsRepository";
import { PostsService } from "./services/PostsService";
import { PostsController } from "./controllers/PostsController";

import { PrismaCommentsRepository } from "./repositories/prisma/PrismaCommentsRepository";
import { CommentsService } from "./services/CommentsService";
import { CommentsController } from "./controllers/CommentsController";

const usersRepository = new PrismaUsersRepository();
const usersService = new UserService(usersRepository);
export const usersController = new UsersController(usersService);

const postsRepository = new PrismaPostsRepository();
const postsService = new PostsService(postsRepository);
export const postsController = new PostsController(postsService);

const commentsRepository = new PrismaCommentsRepository();
const commentsServices = new CommentsService(
  commentsRepository,
  postsRepository
);
export const commentsController = new CommentsController(commentsServices);
