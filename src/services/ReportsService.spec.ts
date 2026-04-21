import { beforeEach, describe, expect, it } from "vitest";
import { ReportsService } from "./ReportsService";
import { AuthenticatedUser } from "./PostsService";
import { randomUUID } from "node:crypto";
import { ReportsRepository } from "../repositories/ReportsRepository";
import { InMemoryReportsRepository } from "../repositories/in-memory/InMemoryReportsRepository";
import { HttpError } from "../errors/HttpError";

describe("Reports Service", () => {
  let reportsRepository: ReportsRepository;
  let reportsService: ReportsService;
  let authenticatedUser: AuthenticatedUser = {
    id: randomUUID(),
    name: "John Doe",
    email: "johndoe@example.com",
    password: "123456",
  };

  beforeEach(() => {
    reportsRepository = new InMemoryReportsRepository();
    reportsService = new ReportsService(reportsRepository);
  });

  it("should create a report", async () => {
    const body = {
      userId: authenticatedUser.id,
      text: "Hello World",
    };

    const report = await reportsService.createReport(body);

    expect(report.text).toEqual(body.text);
  });

  it("should get reports", async () => {
    await reportsService.createReport({ userId: randomUUID(), text: "Hello" });

    for (let i = 0; i < 2; i++) {
      await reportsService.createReport({
        userId: authenticatedUser.id,
        text: i.toString(),
      });
    }

    const { reports } = await reportsService.getReports({
      userId: authenticatedUser.id,
    });

    expect(reports.length).toEqual(2);
    expect(reports.every((r) => r.userId === authenticatedUser.id)).toBe(true);
  });

  it("should throw an error when the report to update is not found", async () => {
    await expect(
      reportsService.updateReport({
        id: randomUUID(),
        text: "Hello",
        userId: authenticatedUser.id,
      }),
    ).rejects.toThrow(new HttpError(404, "Report not found!"));
  });

  it("should throw an error when the user id is not the same of the report to update", async () => {
    const report = await reportsService.createReport({
      userId: authenticatedUser.id,
      text: "Hello World",
    });

    await expect(
      reportsService.updateReport({
        id: report.id,
        text: "Olá Mundo",
        userId: randomUUID(),
      }),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });

  it("should update a report", async () => {
    const report = await reportsService.createReport({
      userId: authenticatedUser.id,
      text: "Hello World!",
    });

    const updatedReport = await reportsService.updateReport({
      id: report.id,
      text: "Olá Mundo!",
      userId: authenticatedUser.id,
    });

    expect(report.text).not.toBe(updatedReport.text);
  });

  it("should throw an error when the report to delete is not found", async () => {
    await expect(
      reportsService.deleteReport({
        id: randomUUID(),
        userId: authenticatedUser.id,
      }),
    ).rejects.toThrow(new HttpError(404, "Report not found!"));
  });

  it("should throw an error when the user id is not the same of the report to delete", async () => {
    const report = await reportsService.createReport({
      userId: authenticatedUser.id,
      text: "Hello world",
    });

    await expect(
      reportsService.deleteReport({
        id: report.id,
        userId: randomUUID(),
      }),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });

  it("should delete a report", async () => {
    const report = await reportsService.createReport({
      userId: authenticatedUser.id,
      text: "Hello world",
    });

    const message = await reportsService.deleteReport({
      id: report.id,
      userId: report.userId,
    });

    expect(message).toContain("successfully deleted");
  });
});
