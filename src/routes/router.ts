import { Router } from "express";
import { usersRouter } from "./usersRouter";
import { postsRouter } from "./postsRouter";
import { commentsRouter } from "./commentsRouter";
import { reportsRouter } from "./reportsRouter";

const router = Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/posts", commentsRouter);
router.use("/reports", reportsRouter);

export default router;
