import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { reportsController } from "../container";

export const reportsRouter = Router();

reportsRouter.get("/", authMiddleware, reportsController.index);
reportsRouter.post("/", authMiddleware, reportsController.create);
reportsRouter.put("/:id", authMiddleware, reportsController.update);
reportsRouter.delete("/:id", authMiddleware, reportsController.delete);
