import { MatchEngineService } from './match-engine.service';
export declare class MatchEngineController {
    private service;
    constructor(service: MatchEngineService);
    match(body: any): Promise<{
        primaryConditionId: string;
        confidence: number;
        parentConditionId?: undefined;
        needsReview?: undefined;
    } | {
        primaryConditionId: any;
        parentConditionId: string;
        confidence: number;
        needsReview: boolean;
    }>;
}
