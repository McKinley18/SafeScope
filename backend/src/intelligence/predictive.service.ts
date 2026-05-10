import { Injectable } from '@nestjs/common';

@Injectable()
export class PredictiveService {
  calculateRisk(findings: any[]) {
    if (!findings.length) return 0;

    const scores = findings.map(
      (f) => f.severity * f.likelihood
    );

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    return Math.round(avg);
  }

  generateAlerts(findings: any[]) {
    const alerts = [];

    findings.forEach((f) => {
      const risk = f.severity * f.likelihood;

      if (risk >= 15) {
        alerts.push({
          type: 'HIGH_RISK',
          message: `High risk hazard: ${f.hazard}`,
        });
      }
    });

    return alerts;
  }
}
