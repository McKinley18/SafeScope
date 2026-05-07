import { Injectable } from '@nestjs/common';

@Injectable()
export class IntelligenceService {
  buildIntelligence(reports: any[]) {
    const totalReports = reports.length;

    let totalFindings = 0;
    let criticalRisk = 0;
    let totalRiskScore = 0;

    const categoryMap: Record<string, number> = {};
    const hazardMap: Record<string, number> = {};
    const standardMap: Record<string, number> = {};
    const clusterMap: Record<string, number> = {};

    for (const r of reports) {
      for (const f of r.findings || []) {
        totalFindings++;

        const risk = this.calculateRisk(f.severity, f.likelihood);
        totalRiskScore += risk;

        if (risk >= 16) criticalRisk++;

        // =========================
        // ✅ FIXED TYPE-SAFE CATEGORY HANDLING
        // =========================
        const categories = new Set<string>(
          (f.standards || [])
            .map((s: any) => s.category)
            .filter((c: any) => typeof c === 'string')
        );

        for (const c of categories) {
          categoryMap[c] = (categoryMap[c] || 0) + 1;
        }

        // =========================
        // STANDARDS
        // =========================
        for (const s of f.standards || []) {
          if (s.citation) {
            standardMap[s.citation] =
              (standardMap[s.citation] || 0) + 1;
          }
        }

        // =========================
        // HAZARD + CLUSTERING
        // =========================
        if (f.hazard) {
          hazardMap[f.hazard] =
            (hazardMap[f.hazard] || 0) + 1;

          const cluster = this.normalizeHazard(f.hazard);
          clusterMap[cluster] =
            (clusterMap[cluster] || 0) + 1;
        }
      }
    }

    const companyRiskIndex =
      totalFindings > 0
        ? Number((totalRiskScore / totalFindings).toFixed(2))
        : 0;

    return {
      totalReports,
      totalFindings,
      criticalRisk,

      companyRiskIndex,
      riskLevel: this.getRiskLevel(companyRiskIndex),

      topCategories: this.sortMap(categoryMap),
      topHazards: this.sortMap(hazardMap),
      topStandards: this.sortMap(standardMap),

      hazardClusters: this.sortMap(clusterMap),
      repeatViolations: this.getRepeatViolations(clusterMap),

      trends: this.groupByDate(reports),
      riskTrend: this.buildRiskTrend(reports),
    };
  }

  // =========================
  // RISK
  // =========================
  private calculateRisk(severity: number, likelihood: number) {
    return severity * likelihood;
  }

  private getRiskLevel(score: number) {
    if (score >= 16) return 'CRITICAL';
    if (score >= 9) return 'HIGH';
    if (score >= 4) return 'MODERATE';
    return 'LOW';
  }

  // =========================
  // HAZARD NORMALIZATION
  // =========================
  private normalizeHazard(hazard: string) {
    if (!hazard) return 'unknown';

    const h = hazard.toLowerCase();

    if (h.includes('unguarded') && h.includes('edge')) {
      return 'unguarded edge';
    }

    if (h.includes('fall')) return 'fall hazard';
    if (h.includes('electrical')) return 'electrical hazard';
    if (h.includes('mobile')) return 'mobile equipment';

    return h.split(' ').slice(0, 2).join(' ');
  }

  // =========================
  // REPEAT VIOLATIONS
  // =========================
  private getRepeatViolations(clusterMap: Record<string, number>) {
    return Object.entries(clusterMap)
      .filter(([_, count]) => count >= 2)
      .map(([key, count]) => ({
        hazard: key,
        count,
        severity: count >= 5 ? 'HIGH' : 'MEDIUM',
      }))
      .sort((a, b) => b.count - a.count);
  }

  // =========================
  // SORT
  // =========================
  private sortMap(map: Record<string, number>) {
    return Object.entries(map)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // =========================
  // DATE TREND
  // =========================
  private groupByDate(reports: any[]) {
    const map: any = {};

    for (const r of reports) {
      if (!r.createdAt) continue;

      const date = new Date(r.createdAt)
        .toISOString()
        .slice(0, 10);

      if (!map[date]) {
        map[date] = {
          date,
          reports: 0,
          findings: 0,
          critical: 0,
        };
      }

      map[date].reports++;

      for (const f of r.findings || []) {
        map[date].findings++;

        const risk = this.calculateRisk(
          f.severity,
          f.likelihood
        );

        if (risk >= 16) map[date].critical++;
      }
    }

    return Object.values(map);
  }

  // =========================
  // RISK TREND
  // =========================
  private buildRiskTrend(reports: any[]) {
    const map: any = {};

    for (const r of reports) {
      if (!r.createdAt) continue;

      const date = new Date(r.createdAt)
        .toISOString()
        .slice(0, 10);

      if (!map[date]) {
        map[date] = {
          date,
          totalRisk: 0,
          findings: 0,
        };
      }

      for (const f of r.findings || []) {
        const risk = this.calculateRisk(
          f.severity,
          f.likelihood
        );

        map[date].totalRisk += risk;
        map[date].findings++;
      }
    }

    return Object.values(map).map((d: any) => ({
      date: d.date,
      avgRisk:
        d.findings > 0
          ? Number((d.totalRisk / d.findings).toFixed(2))
          : 0,
    }));
  }
}
