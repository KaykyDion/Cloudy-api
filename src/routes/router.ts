import { Router } from "express";
import { usersRouter } from "./usersRouter";
import { postsRouter } from "./postsRouter";
import { commentsRouter } from "./commentsRouter";

const router = Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/posts", commentsRouter);

export default router;
