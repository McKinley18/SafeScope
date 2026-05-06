export declare class MatchEngineService {
    match(desc: string, category: string, mode: string): {
        primaryConditionId: string;
        confidence: number;
        parentConditionId?: undefined;
        needsReview?: undefined;
    } | {
        primaryConditionId: any;
        parentConditionId: string;
        confidence: number;
        needsReview: boolean;
    };
}
