import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { ControlVerificationsService } from "./control-verifications.service";

@Controller("control-verifications")
export class ControlVerificationsController {
  constructor(private svc: ControlVerificationsService) {}

@Post(":reportId")
async verify(
  @Param("reportId") reportId: string,
  @Body() body: { control: string; status: "present" | "missing"; notes?: string }
) {
  return this.svc.create(reportId, body);
}

  @Get(":reportId")
  async get(@Param("reportId") reportId: string) {
    return this.svc.getForReport(reportId);
  }
}
