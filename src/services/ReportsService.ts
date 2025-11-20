import { HttpError } from "../errors/HttpError";
import { ReportsRepository } from "../repositories/ReportsRepository";

interface GetReportsProps {
  userId?: string;
}

interface CreateReportProps {
  userId: string;
  text: string;
}

interface UpdateReportProps {
  id: string;
  userId: string;
  text: string;
}

interface DeleteReportProps {
  id: string;
  userId: string;
}

export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async createReport({ text, userId }: CreateReportProps) {
    const report = await this.reportsRepository.createReport({ text, userId });

    return report;
  }

  async getReports({ userId }: GetReportsProps) {
    const reports = await this.reportsRepository.getReports({ userId });

    return { reports };
  }

  async updateReport({ id, text, userId }: UpdateReportProps) {
    const report = await this.reportsRepository.getReportById(id);

    if (!report) {
      throw new HttpError(404, "Report not found!");
    }

    if (report.userId !== userId) {
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    }

    const updatedReport = await this.reportsRepository.updateReport({
      id,
      text,
    });

    return updatedReport;
  }

  async deleteReport({ id, userId }: DeleteReportProps) {
    const report = await this.reportsRepository.getReportById(id);

    if (!report) {
      throw new HttpError(404, "Report not found!");
    }

    if (report.userId !== userId) {
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    }

    await this.reportsRepository.deleteReport(id);

    return "Report successfully deleted!";
  }
}
