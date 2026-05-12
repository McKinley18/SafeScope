import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ControlVerification } from "./entities/control-verification.entity";

@Injectable()
export class ControlVerificationsService {
  constructor(
    @InjectRepository(ControlVerification)
    private repo: Repository<ControlVerification>
  ) {}

  async saveMany(reportId: string, controls: any[]) {
    const entities = (controls || []).map(c =>
      this.repo.create({
        reportId,
        control: c.control,
        status: c.status,
        notes: c.notes,
      })
    );

    return this.repo.save(entities);
  }

async create(reportId: string, dto: any) {
  console.log("CREATE INPUT:", reportId, dto);

  return this.repo.save({
    reportId,
    control: dto.control,
    status: dto.status,
    notes: dto.notes,
  });
}

  async getForReport(reportId: string) {
    return this.repo.find({ where: { reportId } });
  }
}
