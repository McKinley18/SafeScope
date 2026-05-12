import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  generateAlerts(intel: any) {
    const alerts: any[] = [];

    // =========================
    // 🚨 CRITICAL RISK
    // =========================
    if (intel.companyRiskIndex >= 16) {
      alerts.push({
        type: 'CRITICAL_RISK',
        level: 'HIGH',
        message: `Company risk index is CRITICAL (${intel.companyRiskIndex})`,
      });
    }

    // =========================
    // 🚨 REPEAT VIOLATIONS (FIXED)
    // =========================
    for (const v of intel.repeatViolations || []) {
      alerts.push({
        type: 'REPEAT_VIOLATION',
        level:
          v.count >= 5 ? 'HIGH' :
          v.count >= 3 ? 'MEDIUM' :
          'LOW',
        message: `Repeated hazard: ${v.hazard} (${v.count} occurrences)`,
      });
    }

    // =========================
    // 🚨 CATEGORY DOMINANCE (FIXED)
    // =========================
    const topCategory = intel.topCategories?.[0];

    if (topCategory && topCategory.count >= 2) {
      alerts.push({
        type: 'CATEGORY_DOMINANCE',
        level: topCategory.count >= 5 ? 'HIGH' : 'MEDIUM',
        message: `${topCategory.key} is trending (${topCategory.count} findings)`,
      });
    }

    // =========================
    // 🚨 HAZARD CLUSTER ALERT
    // =========================
    const topCluster = intel.hazardClusters?.[0];

    if (topCluster && topCluster.count >= 2) {
      alerts.push({
        type: 'HAZARD_CLUSTER',
        level: topCluster.count >= 5 ? 'HIGH' : 'MEDIUM',
        message: `Cluster forming: ${topCluster.key} (${topCluster.count})`,
      });
    }

    // =========================
    // 🚨 RISK SPIKE
    // =========================
    const trend = intel.riskTrend || [];

    if (trend.length >= 2) {
      const latest = trend[trend.length - 1];
      const prev = trend[trend.length - 2];

      if (latest.avgRisk > prev.avgRisk * 1.25) {
        alerts.push({
          type: 'RISK_SPIKE',
          level: 'HIGH',
          message: `Risk spike detected (${prev.avgRisk} → ${latest.avgRisk})`,
        });
      }
    }

    return alerts;
  }
}
