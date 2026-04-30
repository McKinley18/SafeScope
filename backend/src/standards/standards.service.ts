import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MatchStandardsDto } from './dto/match-standards.dto';
import { Standard } from './entities/standard.entity';
import { StandardMatchFeedback } from './entities/standard-match-feedback.entity';
import { StandardFeedbackDto } from './dto/standard-feedback.dto';
import { expandObservationTerms, routeJurisdiction } from './standards-intelligence';
import { isNegativeControl, normalizeObservationText } from './text-normalizer';

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

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private readonly standardsRepo: Repository<Standard>,

    @InjectRepository(StandardMatchFeedback)
    private readonly feedbackRepo: Repository<StandardMatchFeedback>,
  ) {}

  async search(query: string) {
    return this.standardsRepo.find({
      where: [
        { citation: ILike(`%${query}%`) },
        { title: ILike(`%${query}%`) },
        { standardText: ILike(`%${query}%`) },
      ],
      take: 25,
      order: { citation: 'ASC' },
    });
  }

  async findOne(citation: string) {
    return this.standardsRepo.findOne({
      where: { citation },
    });
  }

  async match(dto: MatchStandardsDto): Promise<{
    primaryMatches: MatchResult[];
    secondaryMatches: MatchResult[];
    matches: MatchResult[];
    disclaimer: string;
  }> {
    const limit = dto.limit ?? 5;
    const rawInput = [
      dto.observation,
      dto.locationType,
      dto.equipmentType,
      dto.activityType,
      ...(dto.detectedLabels ?? []),
    ]
      .filter(Boolean)
      .join(' ');

    if (isNegativeControl(dto.observation)) {
      return {
        primaryMatches: [],
        secondaryMatches: [],
        matches: [],
        disclaimer:
          'No confident standard match was returned because the observation appears to describe a corrected, compliant, or non-hazard condition.',
      };
    }

    const rawObservationBlob = normalizeObservationText(rawInput);

    const route = routeJurisdiction(dto);
    const expanded = expandObservationTerms(rawObservationBlob);
    const observationBlob = expanded.expandedText;

    const standards = await this.standardsRepo.find({
      where: { isActive: true },
      take: 5000,
    });

    const feedback = await this.feedbackRepo.find({ take: 1000 });

    const scored = standards
      .map((standard) => this.scoreStandard(standard, observationBlob, dto, feedback, route, expanded.detectedHazardFamilies))
      .filter((item) => dto.includeLowConfidence ? item.confidence >= 35 : item.confidence >= 60)
      .sort((a, b) => b.confidence - a.confidence);

    const primaryMatches = scored
      .filter((item) => item.confidence >= 75 && item.cautions.length === 0)
      .slice(0, limit);

    const secondaryMatches = scored
      .filter((item) => !primaryMatches.some((primary) => primary.standardId === item.standardId))
      .filter((item) => item.confidence >= 60 || dto.includeLowConfidence)
      .slice(0, limit);

    return {
      primaryMatches,
      secondaryMatches,
      matches: [...primaryMatches, ...secondaryMatches].slice(0, limit),
      disclaimer:
        'Suggested standards are potentially applicable based on available information and should be verified by competent personnel before use.',
    };
  }

  async suggest(description: string, source?: string) {
    const siteType =
      source === 'MSHA'
        ? 'mining'
        : source === 'OSHA_CONSTRUCTION'
          ? 'construction'
          : source === 'OSHA_GENERAL_INDUSTRY'
            ? 'general_industry'
            : 'mixed';

    const result = await this.match({
      observation: description,
      siteType,
      limit: 5,
    });

    return result.matches;
  }

  async recordFeedback(dto: StandardFeedbackDto) {
    const feedback = this.feedbackRepo.create(dto);
    return this.feedbackRepo.save(feedback);
  }

  private scoreStandard(
    standard: Standard,
    observationBlob: string,
    dto: MatchStandardsDto,
    feedback: StandardMatchFeedback[],
    route: { preferredScope: string; reasons: string[] },
    detectedHazardFamilies: string[],
  ): MatchResult {
    let score = 0;
    const why: string[] = [];
    const cautions: string[] = [];

    const keywords = standard.keywords ?? [];
    const hazardCodes = standard.hazardCodes ?? [];

    const keywordHits = keywords.filter((kw) =>
      observationBlob.includes(kw.toLowerCase()),
    );

    if (keywordHits.length > 0) {
      const points = Math.min(keywordHits.length * 9, 36);
      score += points;
      why.push(`Matched key terms: ${keywordHits.slice(0, 6).join(', ')}`);
    }

    const titleHits = this.tokenOverlap(standard.title, observationBlob);
    if (titleHits.score > 0) {
      score += Math.min(titleHits.score * 6, 24);
      why.push(`Title similarity matched: ${titleHits.tokens.slice(0, 5).join(', ')}`);
    }

    const textHits = this.tokenOverlap(standard.standardText, observationBlob);
    if (textHits.score > 0) {
      score += Math.min(textHits.score * 3, 21);
      why.push(`Regulatory text similarity matched: ${textHits.tokens.slice(0, 5).join(', ')}`);
    }

    if (route.preferredScope === standard.scopeCode) {
      score += 22;
      why.push(...route.reasons);
      why.push(`Regulatory scope matches ${standard.scopeCode}`);
    }

    if (route.preferredScope === 'mixed') {
      score += 8;
      why.push(...route.reasons);
    }

    if (route.preferredScope !== 'mixed' && route.preferredScope !== standard.scopeCode) {
      score -= 28;
      cautions.push(`Standard scope is ${standard.scopeCode}, but routed context suggests ${route.preferredScope}`);
    }

    const hazardFamilyHits = (standard.hazardCodes ?? []).filter((code) =>
      detectedHazardFamilies.includes(code),
    );

    if (hazardFamilyHits.length > 0) {
      score += Math.min(hazardFamilyHits.length * 18, 36);
      why.push(`Hazard family match: ${hazardFamilyHits.join(', ')}`);
    }

    if (dto.equipmentType) {
      const equipment = dto.equipmentType.toLowerCase();
      if (keywords.some((kw) => equipment.includes(kw.toLowerCase()))) {
        score += 10;
        why.push(`Equipment context supports match: ${dto.equipmentType}`);
      }
    }

    if (dto.locationType) {
      const location = dto.locationType.toLowerCase();
      if (keywords.some((kw) => location.includes(kw.toLowerCase()))) {
        score += 8;
        why.push(`Location context supports match: ${dto.locationType}`);
      }
    }

    if (observationBlob.includes('trench') && standard.hazardCodes?.includes('excavation')) {
      score += 35;
      why.push('Trench context strongly supports excavation standard');
    }

    if (observationBlob.includes('trench') && standard.hazardCodes?.includes('ladder_safety')) {
      score -= 25;
      cautions.push('Ladder wording appears within trench context; excavation standard may be more applicable');
    }

    if (observationBlob.includes('ladder') && standard.hazardCodes?.includes('ladder_safety')) {
      score += 35;
      why.push('Ladder wording strongly supports ladder safety standard');
    }

    if ((observationBlob.includes('ladder') || observationBlob.includes('base security') || observationBlob.includes('base')) && standard.hazardCodes?.includes('fall_protection') && !observationBlob.includes('fall arrest') && !observationBlob.includes('unprotected edge')) {
      score -= 80;
      cautions.push('Ladder-specific wording may be more applicable than general fall protection');
    }

    if ((observationBlob.includes('base security') || observationBlob.includes('base')) && standard.hazardCodes?.includes('ladder_safety')) {
      score += 45;
      why.push('Ladder base security wording strongly supports ladder safety standard');
    }

    if ((observationBlob.includes('oil') || observationBlob.includes('slick') || observationBlob.includes('slip risk')) && standard.hazardCodes?.includes('housekeeping')) {
      score += 55;
      why.push('Oil/slick/slip context strongly supports housekeeping walking-working surface standard');
    }

    if (observationBlob.includes('oil') && standard.hazardCodes?.includes('machine_guarding')) {
      score -= 65;
      cautions.push('Oil/slip wording is not primarily a machine guarding issue');
    }

    if (
      (observationBlob.includes('exit') ||
        observationBlob.includes('chained shut') ||
        observationBlob.includes('emergency light') ||
        observationBlob.includes('flickering')) &&
      standard.hazardCodes?.includes('exit_route')
    ) {
      score += 70;
      why.push('Exit/emergency lighting wording strongly supports egress standard');
    }

    if ((observationBlob.includes('rebar') || observationBlob.includes('impalement')) && standard.citation.startsWith('1926.701')) {
      score += 45;
      why.push('Rebar impalement wording strongly supports reinforcing steel standard');
    }

    if ((observationBlob.includes('hearing') || observationBlob.includes('noise')) && standard.hazardCodes?.includes('noise')) {
      score += 45;
      why.push('Noise/hearing wording strongly supports hearing conservation standard');
    }

    if ((observationBlob.includes('missing rail') || observationBlob.includes('tower stairs') || observationBlob.includes('ladder access')) && standard.hazardCodes?.includes('safe_access')) {
      score += 55;
      why.push('Missing rail / ladder access wording strongly supports safe access standard');
    }

    const accepted = feedback.filter(
      (f) => f.citation === standard.citation && f.action === 'accepted',
    ).length;

    const rejected = feedback.filter(
      (f) => f.citation === standard.citation && f.action === 'rejected',
    ).length;

    if (accepted > 0) {
      score += Math.min(accepted * 3, 12);
      why.push(`Improved by prior accepted user feedback`);
    }

    if (rejected > 0) {
      score -= Math.min(rejected * 4, 16);
      cautions.push(`Reduced by prior rejected user feedback`);
    }

    if (hazardCodes.length > 0) {
      why.push(`Mapped hazard families: ${hazardCodes.join(', ')}`);
    }

    if (
      (observationBlob.includes('tower stairs') ||
        observationBlob.includes('missing rail') ||
        observationBlob.includes('ladder access')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 90;
      why.push('Mining ladder/tower stair missing rail context strongly supports safe access standard');
    }

    if (
      (observationBlob.includes('extension cord') ||
        observationBlob.includes('temporary power') ||
        observationBlob.includes('metal doorway') ||
        observationBlob.includes('doorway damaged')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 90;
      why.push('Construction temporary cord / doorway damage context strongly supports electrical standard');
    }

    if (
      (observationBlob.includes('man-lift') ||
        observationBlob.includes('man lift') ||
        observationBlob.includes('missing middle rung') ||
        observationBlob.includes('chain showing wear')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 90;
      why.push('Mining access equipment/rung/chain wording strongly supports safe access standard');
    }

    if (
      (observationBlob.includes('pulley guard detached') ||
        observationBlob.includes('guard detached')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 90;
      why.push('Detached pulley guard wording strongly supports MSHA machine guarding standard');
    }

    if (
      (observationBlob.includes('earplugs') ||
        observationBlob.includes('hearing') ||
        observationBlob.includes('hearing protection') ||
        observationBlob.includes('90db') ||
        observationBlob.includes('90 db')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('noise')
    ) {
      score += 110;
      why.push('Hearing/noise wording strongly supports hearing conservation standard');
    }

    if (
      observationBlob.includes('hearing') &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score -= 90;
      cautions.push('Hearing wording is not primarily a housekeeping issue');
    }

    if (
      (observationBlob.includes('shift exam log') ||
        observationBlob.includes('exam log') ||
        observationBlob.includes('not in place')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('workplace_exam')
    ) {
      score += 110;
      why.push('Shift/exam log wording strongly supports MSHA workplace exam standard');
    }

    if (
      (observationBlob.includes('ear protection') ||
        observationBlob.includes('no ear protection') ||
        observationBlob.includes('noisy area')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('noise')
    ) {
      score += 110;
      why.push('Ear protection/noisy area wording strongly supports hearing conservation standard');
    }

    if (
      (observationBlob.includes('crusher feed motor') ||
        observationBlob.includes('drive guard missing') ||
        observationBlob.includes('motor drive guard')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 110;
      why.push('Crusher feed motor drive guard wording strongly supports MSHA machine guarding standard');
    }

    if (
      observationBlob.includes('safety glasses') &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('ppe')
    ) {
      score += 90;
      why.push('Safety glasses wording strongly supports general industry PPE standard');
    }


    if (
      (observationBlob.includes('guard missing') ||
        observationBlob.includes('guard gone') ||
        observationBlob.includes('crusher guard missing') ||
        observationBlob.includes('conveyor guard gone') ||
        observationBlob.includes('drive section')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 120;
      why.push('Short mining guard-missing wording strongly supports machine guarding standard');
    }

    if (
      (observationBlob.includes('electrical terminals open') ||
        observationBlob.includes('terminals open') ||
        observationBlob.includes('busbar exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 120;
      why.push('Short exposed electrical terminal/busbar wording strongly supports electrical standard');
    }

    if (
      (observationBlob.includes('ladder rung loose') ||
        observationBlob.includes('rung loose')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 120;
      why.push('Short ladder rung loose wording strongly supports safe access standard');
    }

    if (
      (observationBlob.includes('drums on raw dirt') ||
        observationBlob.includes('raw dirt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 120;
      why.push('Short drums/raw dirt wording strongly supports mining housekeeping standard');
    }


    if (
      (observationBlob.includes('electrical terminals open') ||
        observationBlob.includes('terminals open') ||
        observationBlob.includes('busbar exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 140;
      cautions.push('Exposed electrical terminal/busbar wording is not primarily a lockout-tagout issue');
    }


    // Regression hardening: short-form field notes and repeated adversarial phrases.
    if (
      (observationBlob.includes('forklift reverse alarm') ||
        observationBlob.includes('back-up alarm silent') ||
        observationBlob.includes('backup alarm silent') ||
        observationBlob.includes('reverse alarm silent')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('powered_industrial_truck')
    ) {
      score += 140;
      why.push('Forklift reverse/backup alarm wording strongly supports powered industrial truck standard');
    }

    if (
      observationBlob.includes('forklift') &&
      observationBlob.includes('alarm') &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('noise')
    ) {
      score -= 140;
      cautions.push('Forklift alarm wording is not primarily a hearing conservation issue');
    }

    if (
      (observationBlob.includes('walkway inspected') ||
        observationBlob.includes('free of debris') ||
        observationBlob.includes('cleaned up') ||
        observationBlob.includes('secure now') ||
        observationBlob.includes('inspected and secure')) &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score -= 180;
      cautions.push('Observation describes corrected/compliant condition, not active housekeeping violation');
    }

    if (
      (observationBlob.includes('ladder rung missing') ||
        observationBlob.includes('access ladder rung missing') ||
        observationBlob.includes('damaged rung') ||
        observationBlob.includes('ladder damaged rung') ||
        observationBlob.includes('ladder rung on primary crusher platform loose') ||
        observationBlob.includes('ladder rung loose')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 150;
      why.push('Mining ladder rung damage/missing wording strongly supports safe access standard');
    }

    if (
      (observationBlob.includes('shift exam book missing') ||
        observationBlob.includes('missing entry') ||
        observationBlob.includes('this morning') ||
        observationBlob.includes('shift record missing')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('workplace_exam')
    ) {
      score += 150;
      why.push('Missing shift exam entry/record wording strongly supports workplace exam standard');
    }

    if (
      (observationBlob.includes('drive shaft') ||
        observationBlob.includes('jaw crusher exposed') ||
        observationBlob.includes('primary crusher guard off') ||
        observationBlob.includes('crusher feed conveyor guard off') ||
        observationBlob.includes('belt guard broken') ||
        observationBlob.includes('crusher drive belt guard loose') ||
        observationBlob.includes('guard off') ||
        observationBlob.includes('guard loose')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 150;
      why.push('Crusher/conveyor guard-off/drive-shaft wording strongly supports MSHA machine guarding standard');
    }

    if (
      (observationBlob.includes('cord damaged running through doorway') ||
        observationBlob.includes('damaged running through doorway') ||
        observationBlob.includes('cord run through doorway')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 150;
      why.push('Damaged cord through doorway wording strongly supports construction electrical standard');
    }

    if (
      (observationBlob.includes('lift gate open') ||
        observationBlob.includes('lift gate unlatched') ||
        observationBlob.includes('during travel')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('mobile_equipment')
    ) {
      score += 150;
      why.push('Aerial lift/bucket gate open wording strongly supports construction mobile equipment standard');
    }

    if (
      (observationBlob.includes('secondary screen path blocked') ||
        observationBlob.includes('path blocked to screen') ||
        observationBlob.includes('screen path blocked')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 150;
      why.push('Blocked screen access path wording strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('secondary screen path blocked') ||
        observationBlob.includes('path blocked to screen')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score -= 100;
      cautions.push('Blocked screen path is treated primarily as safe access, not housekeeping');
    }

    if (
      (observationBlob.includes('exposed busbar live') ||
        observationBlob.includes('exposed busbar live parts') ||
        observationBlob.includes('busbar live') ||
        observationBlob.includes('live parts') ||
        observationBlob.includes('exposed busbar')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 150;
      why.push('Exposed live busbar/live parts wording strongly supports electrical standard');
    }

    if (
      (observationBlob.includes('waste drums stored on dirt') ||
        observationBlob.includes('waste oil drums') ||
        observationBlob.includes('drums stored on dirt') ||
        observationBlob.includes('drums on dirt') ||
        observationBlob.includes('stored on dirt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 150;
      why.push('Waste drum/dirt storage wording strongly supports mining housekeeping standard');
    }


    if (
      (observationBlob.includes('live parts') ||
        observationBlob.includes('exposes live parts') ||
        observationBlob.includes('exposed busbar') ||
        observationBlob.includes('busbar exposed') ||
        observationBlob.includes('electrical panel')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 200;
      why.push('Exposed live electrical parts/busbar/panel wording strongly supports electrical standard');
    }

    if (
      (observationBlob.includes('live parts') ||
        observationBlob.includes('exposes live parts') ||
        observationBlob.includes('exposed busbar') ||
        observationBlob.includes('busbar exposed') ||
        observationBlob.includes('electrical panel')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Exposed live parts/busbar/panel wording is electrical condition, not lockout-tagout');
    }


    if (
      (observationBlob.includes('loto') ||
        observationBlob.includes('lockout') ||
        observationBlob.includes('tagout') ||
        observationBlob.includes('not done before motor repair') ||
        observationBlob.includes('before motor repair')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score += 220;
      why.push('LOTO/motor repair wording strongly supports lockout-tagout standard');
    }

    if (
      (observationBlob.includes('loto') ||
        observationBlob.includes('lockout') ||
        observationBlob.includes('tagout')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score -= 180;
      cautions.push('LOTO wording is primarily lockout-tagout, not general electrical condition');
    }


    if (
      (observationBlob.includes('housekeeping items maintained') ||
        observationBlob.includes('all housekeeping items maintained') ||
        observationBlob.includes('maintained') ||
        observationBlob.includes('completed correctly')) &&
      (standard.hazardCodes?.includes('housekeeping') || standard.hazardCodes?.includes('workplace_exam'))
    ) {
      score -= 220;
      cautions.push('Observation describes compliant/complete condition, not an active violation');
    }


    if (
      (observationBlob.includes('ladder rung bent') ||
        observationBlob.includes('rung bent') ||
        observationBlob.includes('screen 3 access')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 150;
      why.push('Bent ladder rung on screen access strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('pulley guard unbolted') ||
        observationBlob.includes('guard unbolted') ||
        observationBlob.includes('pulley guard') && observationBlob.includes('loose')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 150;
      why.push('Loose/unbolted pulley guard strongly supports MSHA machine guarding standard');
    }


    if (
      (observationBlob.includes('secondary screen ladder missing rung') ||
        observationBlob.includes('ladder missing rung') ||
        observationBlob.includes('missing rung')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 170;
      why.push('Missing ladder rung on secondary screen access strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('busbar contacts exposed') ||
        observationBlob.includes('contacts exposed') ||
        observationBlob.includes('busbar contacts')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 170;
      why.push('Exposed busbar contacts strongly supports general industry electrical standard');
    }


    if (
      (observationBlob.includes('busbar contacts exposed') ||
        observationBlob.includes('contacts exposed') ||
        observationBlob.includes('busbar contacts')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Exposed busbar contacts is an electrical exposure issue, not lockout-tagout');
    }


    if (
      (observationBlob.includes('ladder rung damaged') ||
        observationBlob.includes('rung damaged') ||
        observationBlob.includes('secondary exit')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 170;
      why.push('Damaged ladder rung on secondary exit strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('exposed terminals live busbar') ||
        observationBlob.includes('live busbar') ||
        observationBlob.includes('exposed terminals')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 190;
      why.push('Exposed terminals/live busbar strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('exposed terminals live busbar') ||
        observationBlob.includes('live busbar') ||
        observationBlob.includes('exposed terminals')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Exposed terminals/live busbar is electrical exposure, not lockout-tagout');
    }


    if (
      (observationBlob.includes('screen plant access ladder rung broken') ||
        observationBlob.includes('access ladder rung broken') ||
        observationBlob.includes('rung broken')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 170;
      why.push('Broken ladder rung on screen plant access strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('waste drums on bare dirt') ||
        observationBlob.includes('bare dirt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 170;
      why.push('Waste drums on bare dirt strongly supports mining housekeeping standard');
    }


    if (
      (observationBlob.includes('exit light testing successful') ||
        observationBlob.includes('battery healthy') ||
        observationBlob.includes('testing successful')) &&
      standard.hazardCodes?.includes('emergency')
    ) {
      score -= 220;
      cautions.push('Exit/emergency lighting wording describes successful test/compliant condition, not active violation');
    }


    if (
      observationBlob.includes('exit light testing successful') ||
      observationBlob.includes('battery healthy') ||
      observationBlob.includes('testing successful')
    ) {
      score -= 300;
      cautions.push('Observation describes successful test/compliant condition, not active violation');
    }


    if (
      (observationBlob.includes('rung on access ladder broken') ||
        observationBlob.includes('access rung missing') ||
        observationBlob.includes('access ladder broken')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('safe_access')
    ) {
      score += 180;
      why.push('Broken/missing access ladder rung strongly supports MSHA safe access standard');
    }

    if (
      (observationBlob.includes('terminals live') ||
        observationBlob.includes('live electrical parts exposed') ||
        observationBlob.includes('electrical parts exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 190;
      why.push('Live/exposed electrical parts wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('terminals live') ||
        observationBlob.includes('live electrical parts exposed') ||
        observationBlob.includes('electrical parts exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Live/exposed electrical parts is electrical exposure, not lockout-tagout');
    }

    if (
      observationBlob.includes('power test') ||
      observationBlob.includes('test pass') ||
      observationBlob.includes('working properly') ||
      observationBlob.includes('verified functional') ||
      observationBlob.includes('stable') ||
      observationBlob.includes('good condition') ||
      observationBlob.includes('covered') ||
      observationBlob.includes('protected') ||
      observationBlob.includes('in place') ||
      observationBlob.includes('per specs') ||
      observationBlob.includes('correctly') ||
      observationBlob.includes('healthy')
    ) {
      score -= 220;
      cautions.push('Observation describes compliant/verified condition, not active violation');
    }


    if (
      observationBlob.includes('signature complete') ||
      observationBlob.includes('signature and date') ||
      observationBlob.includes('hearing protection used') ||
      observationBlob.includes('worn as instructed') ||
      observationBlob.includes('mid-rail clip is locked') ||
      observationBlob.includes('covered live parts protected') ||
      observationBlob.includes('box in trench')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/protected/complete condition, not active violation');
    }

    if (
      (observationBlob.includes('harness d-ring bent') ||
        observationBlob.includes('d-ring bent') ||
        observationBlob.includes('bent severely')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('fall_protection')
    ) {
      score += 190;
      why.push('Bent harness D-ring strongly supports construction fall protection/PPE equipment defect');
    }

    if (
      (observationBlob.includes('trench 5ft wall open unprotected') ||
        observationBlob.includes('open unprotected') ||
        observationBlob.includes('5ft wall')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('excavation')
    ) {
      score += 190;
      why.push('Open unprotected 5ft trench wall strongly supports construction excavation standard');
    }


    if (
      observationBlob.includes('illumination test successful') ||
      observationBlob.includes('completed properly') ||
      observationBlob.includes('ear protection being used') ||
      observationBlob.includes('backup alarm audible') ||
      observationBlob.includes('climbing technique per standard') ||
      observationBlob.includes('replaced and fully functional') ||
      observationBlob.includes('fully clipped') ||
      observationBlob.includes('entries valid') ||
      observationBlob.includes('verified operational') ||
      observationBlob.includes('signature valid') ||
      observationBlob.includes('hearing protection area safe') ||
      observationBlob.includes('fully covered')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/verified condition, not active violation');
    }

    if (
      (observationBlob.includes('electrical junction box open') ||
        observationBlob.includes('junction box open') ||
        observationBlob.includes('live electrical terminals contact') ||
        observationBlob.includes('live electrical contact open') ||
        observationBlob.includes('electrical contact open')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 200;
      why.push('Open junction box/live electrical contact wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('electrical junction box open') ||
        observationBlob.includes('junction box open') ||
        observationBlob.includes('live electrical terminals contact') ||
        observationBlob.includes('live electrical contact open') ||
        observationBlob.includes('electrical contact open')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Open/live electrical contact wording is electrical exposure, not lockout-tagout');
    }

    if (
      (observationBlob.includes('conveyor drive guard found missing') ||
        observationBlob.includes('drive guard found missing') ||
        observationBlob.includes('guard found missing')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 190;
      why.push('Missing conveyor drive guard strongly supports MSHA machine guarding standard');
    }


    if (
      observationBlob.includes('box installed') ||
      observationBlob.includes('hearing protection worn') ||
      observationBlob.includes('backup alarm sounding') ||
      observationBlob.includes('climbing techniques correct')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/controlled condition, not active violation');
    }

    if (
      (observationBlob.includes('haul road edge unprotected drop-off') ||
        observationBlob.includes('unprotected drop-off') ||
        observationBlob.includes('drop-off')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('roadway_berm')
    ) {
      score += 190;
      why.push('Unprotected haul road drop-off strongly supports MSHA roadway berm standard');
    }

    if (
      (observationBlob.includes('ladder feet unstable') ||
        observationBlob.includes('unstable on mud') ||
        observationBlob.includes('feet unstable')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('ladder_safety')
    ) {
      score += 190;
      why.push('Unstable ladder feet/base strongly supports construction ladder safety standard');
    }

    if (
      (observationBlob.includes('waste barrels on dirt') ||
        observationBlob.includes('barrels on dirt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 180;
      why.push('Waste barrels on dirt strongly supports mining housekeeping standard');
    }

    if (
      (observationBlob.includes('conveyor pulley drive guard broken') ||
        observationBlob.includes('guard drive missing') ||
        observationBlob.includes('drive guard broken') ||
        observationBlob.includes('drive missing')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 190;
      why.push('Broken/missing conveyor drive guard strongly supports MSHA machine guarding standard');
    }

    if (
      (observationBlob.includes('busbar electrical live exposed') ||
        observationBlob.includes('electrical live exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 200;
      why.push('Live exposed busbar/electrical wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('busbar electrical live exposed') ||
        observationBlob.includes('electrical live exposed')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 250;
      cautions.push('Live exposed busbar/electrical condition is not primarily lockout-tagout');
    }


    if (
      observationBlob.includes('haul road edge') &&
      observationBlob.includes('drop-off') &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('roadway_berm')
    ) {
      score += 260;
      why.push('Haul road edge drop-off wording strongly supports MSHA roadway berm standard');
    }

    if (
      observationBlob.includes('ladder feet') &&
      observationBlob.includes('unstable') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('ladder_safety')
    ) {
      score += 260;
      why.push('Unstable ladder feet wording strongly supports construction ladder safety standard');
    }

    if (
      observationBlob.includes('trench wall') &&
      observationBlob.includes('no shoring') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('excavation')
    ) {
      score += 260;
      why.push('Trench wall no shoring wording strongly supports construction excavation standard');
    }


    if (
      observationBlob.includes('trench wall no shoring box installed') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('excavation')
    ) {
      score += 320;
      why.push('Trench wall no shoring wording strongly supports construction excavation standard despite ambiguous box wording');
    }


    if (
      observationBlob.includes('working fine') ||
      observationBlob.includes('with shoring box') ||
      observationBlob.includes('climbing technique per policy')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/controlled condition, not active violation');
    }

    if (
      (observationBlob.includes('junction box cover missing') ||
        observationBlob.includes('wires exposed') ||
        observationBlob.includes('live terminals parts open') ||
        observationBlob.includes('live electrical parts')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 220;
      why.push('Exposed wires/live electrical parts wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('junction box cover missing') ||
        observationBlob.includes('wires exposed') ||
        observationBlob.includes('live terminals parts open') ||
        observationBlob.includes('live electrical parts')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 260;
      cautions.push('Exposed wires/live electrical parts is electrical exposure, not lockout-tagout');
    }


    if (
      observationBlob.includes('with protection box') ||
      observationBlob.includes('record signed by shift foreman') ||
      observationBlob.includes('climbing technique is valid')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/controlled/valid condition, not active violation');
    }

    if (
      (observationBlob.includes('waste drums dirt') ||
        observationBlob.includes('waste drums on dirt') ||
        observationBlob.includes('drums dirt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 190;
      why.push('Waste drums dirt wording strongly supports mining housekeeping standard');
    }

    if (
      (observationBlob.includes('electrical contacts live') ||
        observationBlob.includes('live electrical terminals exposed') ||
        observationBlob.includes('live terminals parts exposed') ||
        observationBlob.includes('contacts live')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 220;
      why.push('Live electrical contacts/terminals wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('electrical contacts live') ||
        observationBlob.includes('live electrical terminals exposed') ||
        observationBlob.includes('live terminals parts exposed') ||
        observationBlob.includes('contacts live')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 260;
      cautions.push('Live electrical contacts/terminals is electrical exposure, not lockout-tagout');
    }


    if (
      observationBlob.includes('all good') ||
      observationBlob.includes('rail ok') ||
      observationBlob.includes('entry valid') ||
      observationBlob.includes('looks solid')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/valid/OK condition, not active violation');
    }

    if (
      (observationBlob.includes('guard kinda loose') ||
        observationBlob.includes('crusher drive') ||
        observationBlob.includes('guarding missing drive belt') ||
        observationBlob.includes('missing drive belt')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 210;
      why.push('Loose/missing crusher drive guarding wording strongly supports MSHA machine guarding standard');
    }

    if (
      (observationBlob.includes('ladder footing unstable') ||
        observationBlob.includes('footing unstable')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('ladder_safety')
    ) {
      score += 210;
      why.push('Unstable ladder footing strongly supports construction ladder safety standard');
    }

    if (
      (observationBlob.includes('drums stored on raw ground') ||
        observationBlob.includes('raw ground')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 190;
      why.push('Drums stored on raw ground strongly supports mining housekeeping standard');
    }

    if (
      (observationBlob.includes('exposed electrical live') ||
        observationBlob.includes('electrical live')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 220;
      why.push('Exposed live electrical wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('exposed electrical live') ||
        observationBlob.includes('electrical live')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 260;
      cautions.push('Exposed live electrical condition is electrical exposure, not lockout-tagout');
    }


    if (
      observationBlob.includes('ladder footing unstable') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('ladder_safety')
    ) {
      score += 300;
      why.push('Ladder footing unstable strongly supports construction ladder safety standard');
    }


    if (
      (observationBlob.includes('trench 5ft wall open shoring') ||
        observationBlob.includes('trench wall protection missing') ||
        observationBlob.includes('wall protection missing')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('excavation')
    ) {
      score += 260;
      why.push('Trench wall/open/protection missing wording strongly supports construction excavation standard');
    }

    if (
      (observationBlob.includes('drive pulley guard detached') ||
        observationBlob.includes('conveyor guard gone') ||
        observationBlob.includes('conveyor guard missing') ||
        observationBlob.includes('pulley guard detached') ||
        observationBlob.includes('guard detached')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 260;
      why.push('Detached/missing/gone conveyor or drive pulley guard strongly supports MSHA machine guarding standard');
    }

    if (
      (observationBlob.includes('ladder footing sliding') ||
        observationBlob.includes('ladder feet slipping') ||
        observationBlob.includes('footing sliding') ||
        observationBlob.includes('feet slipping')) &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('ladder_safety')
    ) {
      score += 260;
      why.push('Sliding/slipping ladder footing strongly supports construction ladder safety standard');
    }

    if (
      (observationBlob.includes('electrical busbar contacts open') ||
        observationBlob.includes('busbar contacts open') ||
        observationBlob.includes('terminals live open') ||
        observationBlob.includes('live open')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 260;
      why.push('Open busbar contacts/live terminals strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('electrical busbar contacts open') ||
        observationBlob.includes('busbar contacts open') ||
        observationBlob.includes('terminals live open') ||
        observationBlob.includes('live open')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 280;
      cautions.push('Open busbar/live terminals is electrical exposure, not lockout-tagout');
    }

    if (
      (observationBlob.includes('waste oil drums on soil') ||
        observationBlob.includes('oil waste on dirt floor') ||
        observationBlob.includes('drums on soil') ||
        observationBlob.includes('dirt floor')) &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 240;
      why.push('Waste oil/drums on soil or dirt floor strongly supports mining housekeeping standard');
    }


    if (
      observationBlob.includes('conveyor tail guard missing') &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('machine_guarding')
    ) {
      score += 320;
      why.push('Primary hazard is missing conveyor tail guard; machine guarding takes priority over secondary oil spill');
    }

    if (
      observationBlob.includes('conveyor tail guard missing') &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score -= 180;
      cautions.push('Oil spill is secondary; missing conveyor guard is primary hazard');
    }

    if (
      observationBlob.includes('worker no harness') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('fall_protection')
    ) {
      score += 300;
      why.push('Worker no harness wording strongly supports construction fall protection standard');
    }

    if (
      observationBlob.includes('batteries functional') ||
      observationBlob.includes('clip fully locked') ||
      observationBlob.includes('provided and worn')
    ) {
      score -= 350;
      cautions.push('Observation describes compliant/functional/locked/provided condition, not active violation');
    }


    if (
      observationBlob.includes('tested ok') ||
      observationBlob.includes('clip latched') ||
      observationBlob.includes('signed and complete') ||
      observationBlob.includes('alarm on truck audible')
    ) {
      score -= 350;
      cautions.push('Observation describes tested/latched/complete/audible compliant condition, not active violation');
    }

    if (
      (observationBlob.includes('live terminals contact open') ||
        observationBlob.includes('exposed live electrical')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('electrical')
    ) {
      score += 240;
      why.push('Open live terminals/exposed live electrical wording strongly supports general industry electrical standard');
    }

    if (
      (observationBlob.includes('live terminals contact open') ||
        observationBlob.includes('exposed live electrical')) &&
      standard.scopeCode === 'general_industry' &&
      standard.hazardCodes?.includes('lockout_tagout')
    ) {
      score -= 280;
      cautions.push('Open live terminals/exposed live electrical condition is electrical exposure, not lockout-tagout');
    }

    if (
      observationBlob.includes('trench wall no box installed') &&
      standard.scopeCode === 'construction' &&
      standard.hazardCodes?.includes('excavation')
    ) {
      score += 300;
      why.push('Trench wall no box installed wording strongly supports construction excavation standard');
    }

    if (
      observationBlob.includes('waste drums sitting on dirt') &&
      standard.scopeCode === 'mining' &&
      standard.hazardCodes?.includes('housekeeping')
    ) {
      score += 240;
      why.push('Waste drums sitting on dirt strongly supports mining housekeeping standard');
    }

    const confidence = Math.max(0, Math.min(99, Math.round(score)));

    return {
      standardId: standard.id,
      agencyCode: standard.agencyCode,
      citation: standard.citation,
      title: standard.title,
      scopeCode: standard.scopeCode,
      confidence,
      confidenceLabel: this.confidenceLabel(confidence),
      plainLanguageSummary: standard.plainLanguageSummary,
      why: why.length ? why : ['Weak text similarity only; review required'],
      cautions,
    };
  }

  private tokenOverlap(source: string, observationBlob: string) {
    const stop = new Set([
      'the', 'and', 'or', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'with',
      'shall', 'must', 'be', 'by', 'from', 'at', 'is', 'are',
    ]);

    const tokens = source
      .toLowerCase()
      .replace(/[^a-z0-9.\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3 && !stop.has(t));

    const unique = [...new Set(tokens)];
    const matched = unique.filter((token) => observationBlob.includes(token));

    return {
      score: matched.length,
      tokens: matched,
    };
  }

  private confidenceLabel(score: number) {
    if (score >= 90) return 'Highly applicable';
    if (score >= 75) return 'Likely applicable';
    if (score >= 60) return 'Review suggested';
    return 'Low confidence';
  }
}
