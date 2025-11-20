import { Prisma, Reports } from "@prisma/client";

export interface UpdateReportProps {
  id: string;
  text: string;
}

export interface GetReportsProps {
  userId?: string;
}

export interface ReportsRepository {
  getReports({ userId }: GetReportsProps): Promise<Reports[]>;

  getReportById(id: string): Promise<Reports | null>;

  createReport(data: Prisma.ReportsUncheckedCreateInput): Promise<Reports>;

  updateReport(data: UpdateReportProps): Promise<Reports>;

  deleteReport(id: string): Promise<void>;
}
