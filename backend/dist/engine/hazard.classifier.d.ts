type ClassificationResult = {
    hazardTypes: string[];
    confidence: number;
    signals: string[];
};
export declare const classifyHazard: (text: string) => ClassificationResult;
export declare const rankHazards: (hazardTypes: string[]) => {
    type: string;
    weight: number;
}[];
export {};
