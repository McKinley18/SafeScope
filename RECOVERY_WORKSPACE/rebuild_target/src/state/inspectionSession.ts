let inspectionFindings: any[] = [];

export function setInspectionFindings(findings: any[]) {
  inspectionFindings = findings;
}

export function getInspectionFindings() {
  return inspectionFindings;
}

export function clearInspectionFindings() {
  inspectionFindings = [];
}
