import { Handler } from "express";
import {
  CreateReportRequestSchema,
  GetReportsQuerySchema,
} from "./schemas/ReportsRequestSchema";
import { ReportsService } from "../services/ReportsService";

export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const { userId } = GetReportsQuerySchema.parse(req.query);

      const result = await this.reportsService.getReports({ userId });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const { text } = CreateReportRequestSchema.parse(req.body);
      const authenticatedUser = req.authenticatedUser;

      const report = await this.reportsService.createReport({
        text,
        userId: authenticatedUser.id,
      });

      res.json(report);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const authenticatedUser = req.authenticatedUser;

      const { text } = CreateReportRequestSchema.parse(req.body);

      const updatedReport = await this.reportsService.updateReport({
        id,
        text,
        userId: authenticatedUser.id,
      });

      res.json(updatedReport);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const authenticatedUser = req.authenticatedUser;

      const message = await this.reportsService.deleteReport({
        id,
        userId: authenticatedUser.id,
      });

      res.json({ message });
    } catch (error) {
      next(error);
    }
  };
}
