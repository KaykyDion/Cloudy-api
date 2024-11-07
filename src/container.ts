import { UsersController } from "./controllers/UsersController";
import { PrismaUsersRepository } from "./repositories/prisma/PrismaUsersRepository";
import { UserService } from "./services/UsersService";

const usersRepository = new PrismaUsersRepository();
const usersService = new UserService(usersRepository);
export const usersController = new UsersController(usersService);
