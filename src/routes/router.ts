import { Router } from "express";
import { usersRouter } from "./usersRouter";

const router = Router();

router.use("/users", usersRouter);

router.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

export default router;
