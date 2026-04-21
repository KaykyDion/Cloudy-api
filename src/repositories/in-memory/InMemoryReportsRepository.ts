import { Reports, Prisma } from "@prisma/client";
import {
  GetReportsProps,
  ReportsRepository,
  UpdateReportProps,
} from "../ReportsRepository";
import { randomUUID } from "node:crypto";

export class InMemoryReportsRepository implements ReportsRepository {
  public reports: Reports[] = [];

  async getReports({ userId }: GetReportsProps): Promise<Reports[]> {
    if (userId) {
      return this.reports.filter((r) => r.userId === userId);
    }

    return this.reports;
  }

  async getReportById(id: string): Promise<Reports | null> {
    const report = this.reports.find((r) => r.id === id);

    return report || null;
  }

  async createReport({
    text,
    userId,
  }: Prisma.ReportsUncheckedCreateInput): Promise<Reports> {
    const report: Reports = {
      id: randomUUID(),
      createdAt: new Date(),
      text,
      userId,
    };

    this.reports.push(report);

    return report;
  }

  async updateReport({ id, text }: UpdateReportProps): Promise<Reports> {
    this.reports = this.reports.map((r) => (r.id === id ? { ...r, text } : r));
    return this.reports.find((r) => r.id === id)!;
  }

  async deleteReport(id: string): Promise<void> {
    const updatedReports = this.reports.filter((r) => r.id !== id);

    this.reports = updatedReports;
  }
}
