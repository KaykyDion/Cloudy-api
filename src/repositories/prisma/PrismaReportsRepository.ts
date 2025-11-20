import { Reports, Prisma } from "@prisma/client";
import {
  GetReportsProps,
  ReportsRepository,
  UpdateReportProps,
} from "../ReportsRepository";
import { prisma } from "../../database";

export class PrismaReportsRepository implements ReportsRepository {
  async getReports({ userId }: GetReportsProps): Promise<Reports[]> {
    return await prisma.reports.findMany({
      where: { ...(userId && { userId }) },
      orderBy: { createdAt: "desc" },
    });
  }

  async getReportById(id: string): Promise<Reports | null> {
    return await prisma.reports.findUnique({ where: { id } });
  }

  async createReport(
    data: Prisma.ReportsUncheckedCreateInput
  ): Promise<Reports> {
    return await prisma.reports.create({ data });
  }

  async updateReport({ id, text }: UpdateReportProps): Promise<Reports> {
    return await prisma.reports.update({ where: { id }, data: { text } });
  }

  async deleteReport(id: string): Promise<void> {
    await prisma.reports.delete({ where: { id } });
  }
}
