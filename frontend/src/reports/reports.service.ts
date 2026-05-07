import { Injectable } from '@nestjs/common';
import { StandardsService } from '../standards/standards.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly standardsService: StandardsService, // 🔑 injected
  ) {}

  processFinding(finding: any) {
    const riskScore = finding.severity * finding.likelihood;

    let priority = 'Low';
    if (riskScore >= 15) priority = 'Critical';
    else if (riskScore >= 10) priority = 'High';
    else if (riskScore >= 5) priority = 'Medium';

    const standards = this.standardsService.matchHazard(finding.hazard);

    return {
      ...finding,
      riskScore,
      priority,
      standards,
    };
  }
}
