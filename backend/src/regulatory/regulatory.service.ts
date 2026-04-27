import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { RegulatorySection } from './entities/regulatory-section.entity';
import { RegulatoryPart } from './entities/regulatory-part.entity';

@Injectable()
export class RegulatoryService {
  constructor(
    @InjectRepository(RegulatorySection)
    private sectionRepo: Repository<RegulatorySection>,
    @InjectRepository(RegulatoryPart)
    private partRepo: Repository<RegulatoryPart>,
  ) {}

  async getParts(agency: string) {
    return await this.partRepo.find({ where: { agencyCode: agency } });
  }

  async searchSections(agency: string, part: string, query?: string) {
    const where: any = { agencyCode: agency, part };
    if (query) {
      where.heading = ILike(`%${query}%`);
    }
    return await this.sectionRepo.find({ where });
  }

  async getSection(citation: string) {
    return await this.sectionRepo.findOne({ where: { citation } });
  }
}
