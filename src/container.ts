import { PrismaUsersRepository } from "./repositories/prisma/PrismaUsersRepository";
import { UserService } from "./services/UsersService";
import { UsersController } from "./controllers/UsersController";

import { PrismaPostsRepository } from "./repositories/prisma/PrismaPostsRepository";
import { PostsService } from "./services/PostsService";
import { PostsController } from "./controllers/PostsController";

import { PrismaCommentsRepository } from "./repositories/prisma/PrismaCommentsRepository";
import { CommentsService } from "./services/CommentsService";
import { CommentsController } from "./controllers/CommentsController";
import { PrismaReportsRepository } from "./repositories/prisma/PrismaReportsRepository";
import { ReportsService } from "./services/ReportsService";
import { ReportsController } from "./controllers/ReportsControllers";

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

const reportsRepository = new PrismaReportsRepository();
const reportsService = new ReportsService(reportsRepository);
export const reportsController = new ReportsController(reportsService);
