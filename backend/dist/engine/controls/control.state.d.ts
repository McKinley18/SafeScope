export type ControlStateType = "present" | "missing" | "unknown" | "verified";
export interface ControlState {
    control: string;
    state: ControlStateType;
    source: "text" | "hazard" | "user" | "ai";
    confidence: number;
}
export declare function buildControlStates(hazardTypes: string[], controlFindings: any[], requiredControls: string[]): ControlState[];
