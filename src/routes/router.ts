import { Router } from "express";
import { usersRouter } from "./usersRouter";
import { postsRouter } from "./postsRouter";

const router = Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);

export default router;
