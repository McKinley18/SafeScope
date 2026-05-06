export declare const calculateControlScore: (required: string[], present: {
    control: string;
}[]) => {
    score: number;
    requiredCount: number;
    missingCount: number;
    missingControls: string[];
};
