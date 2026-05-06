export interface RiskInput {
    severity?: string;
    probability?: number;
    exposure?: number;
    narrative?: string;
    industry?: string;
    controls?: any[];
}
export declare const calculateRisk: (input: RiskInput & {
    controls?: any[];
}) => {
    severityScore: any;
    probabilityScore: number;
    exposureScore: number;
    riskScore: number;
    riskBand: string;
    industry: string;
};
export declare const calculateHazardRisk: (base: RiskInput, hazardType: string) => {
    severityScore: any;
    probabilityScore: number;
    exposureScore: number;
    riskScore: number;
    riskBand: string;
    industry: string;
};
