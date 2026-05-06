import { MatchStandardsDto } from './dto/match-standards.dto';
import { StandardFeedbackDto } from './dto/standard-feedback.dto';
import { StandardsService } from './standards.service';
export declare class StandardsController {
    private readonly standardsService;
    constructor(standardsService: StandardsService);
    match(dto: MatchStandardsDto): Promise<{
        primaryMatches: {
            standardId: string;
            agencyCode: string;
            citation: string;
            title: string;
            scopeCode: string;
            confidence: number;
            confidenceLabel: string;
            plainLanguageSummary?: string;
            why: string[];
            cautions: string[];
        }[];
        secondaryMatches: {
            standardId: string;
            agencyCode: string;
            citation: string;
            title: string;
            scopeCode: string;
            confidence: number;
            confidenceLabel: string;
            plainLanguageSummary?: string;
            why: string[];
            cautions: string[];
        }[];
        matches: {
            standardId: string;
            agencyCode: string;
            citation: string;
            title: string;
            scopeCode: string;
            confidence: number;
            confidenceLabel: string;
            plainLanguageSummary?: string;
            why: string[];
            cautions: string[];
        }[];
        disclaimer: string;
    }>;
    feedback(dto: StandardFeedbackDto): Promise<import("./entities/standard-match-feedback.entity").StandardMatchFeedback>;
    search(query: string): Promise<import("./entities/standard.entity").Standard[]>;
    findOne(citation: string): Promise<import("./entities/standard.entity").Standard>;
}
