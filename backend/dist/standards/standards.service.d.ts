import { Repository } from 'typeorm';
import { MatchStandardsDto } from './dto/match-standards.dto';
import { Standard } from './entities/standard.entity';
import { StandardMatchFeedback } from './entities/standard-match-feedback.entity';
import { StandardFeedbackDto } from './dto/standard-feedback.dto';
type MatchResult = {
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
};
export declare class StandardsService {
    private readonly standardsRepo;
    private readonly feedbackRepo;
    constructor(standardsRepo: Repository<Standard>, feedbackRepo: Repository<StandardMatchFeedback>);
    search(query: string): Promise<Standard[]>;
    findByControls(controlCodes: string[]): Promise<Standard[]>;
    findOne(citation: string): Promise<Standard>;
    match(dto: MatchStandardsDto): Promise<{
        primaryMatches: MatchResult[];
        secondaryMatches: MatchResult[];
        matches: MatchResult[];
        disclaimer: string;
    }>;
    suggest(description: string, source?: string): Promise<MatchResult[]>;
    recordFeedback(dto: StandardFeedbackDto): Promise<StandardMatchFeedback>;
    private scoreStandard;
    private tokenOverlap;
    private confidenceLabel;
}
export {};
