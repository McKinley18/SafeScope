"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulatorySyncService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("axios");
const xml2js = require("xml2js");
const regulatory_agency_entity_1 = require("./entities/regulatory-agency.entity");
const regulatory_part_entity_1 = require("./entities/regulatory-part.entity");
const regulatory_subpart_entity_1 = require("./entities/regulatory-subpart.entity");
const regulatory_section_entity_1 = require("./entities/regulatory-section.entity");
const regulatory_paragraph_entity_1 = require("./entities/regulatory-paragraph.entity");
let RegulatorySyncService = class RegulatorySyncService {
    constructor(sectionRepo, partRepo, agencyRepo, subpartRepo, paragraphRepo) {
        this.sectionRepo = sectionRepo;
        this.partRepo = partRepo;
        this.agencyRepo = agencyRepo;
        this.subpartRepo = subpartRepo;
        this.paragraphRepo = paragraphRepo;
    }
    async syncRegulatoryPart(opts) {
        const response = await axios_1.default.get(opts.bulkXmlUrl);
        const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
        const result = await parser.parseStringPromise(response.data);
        const findPart = (node) => {
            if (node.TYPE === 'PART' && node.N === opts.part)
                return node;
            for (const key in node) {
                if (typeof node[key] === 'object') {
                    const found = findPart(node[key]);
                    if (found)
                        return found;
                }
            }
            return null;
        };
        const partNode = findPart(result);
        if (!partNode)
            return { sectionsUpserted: 0, paragraphsUpserted: 0 };
        const pack = opts.agencyCode === 'OSHA' ? (opts.part === '1904' ? 'OSHA Recordkeeping' : opts.part === '1910' ? 'OSHA General Industry' : 'OSHA Construction') : 'MSHA Mining';
        await this.agencyRepo.upsert({ code: opts.agencyCode, name: opts.agencyName, titleNumber: opts.titleNumber }, ['code']);
        await this.partRepo.upsert({ agencyCode: opts.agencyCode, titleNumber: opts.titleNumber, part: opts.part, heading: partNode.HEAD || 'Part ' + opts.part, customerPack: pack }, ['agencyCode', 'titleNumber', 'part']);
        let sectionsUpserted = 0, paragraphsUpserted = 0;
        const traverse = async (node) => {
            if (node.TYPE === 'SECTION') {
                const sectionNo = node.N?.replace('§ ', '') || '0';
                const citation = `${opts.titleNumber} CFR ${opts.part}.${sectionNo}`;
                await this.sectionRepo.upsert({
                    agencyCode: opts.agencyCode, titleNumber: opts.titleNumber, part: opts.part,
                    section: sectionNo, citation, heading: node.HEAD, textPlain: Array.isArray(node.P) ? node.P.join(' ') : (node.P || '')
                }, ['citation']);
                sectionsUpserted++;
            }
            else if (typeof node === 'object') {
                for (const key in node)
                    await traverse(node[key]);
            }
        };
        await traverse(partNode);
        return { sectionsUpserted, paragraphsUpserted };
    }
    async syncPart46() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '46', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart47() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '47', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart48() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '48', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart50() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '50', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart56() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '56', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart57() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '57', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart62() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '62', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncPart77() { return this.syncRegulatoryPart({ agencyCode: 'MSHA', agencyName: 'MSHA', titleNumber: '30', part: '77', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-30/ECFR-title30.xml' }); }
    async syncOsha1904() { return this.syncRegulatoryPart({ agencyCode: 'OSHA', agencyName: 'OSHA', titleNumber: '29', part: '1904', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-29/ECFR-title29.xml' }); }
    async syncOsha1910() { return this.syncRegulatoryPart({ agencyCode: 'OSHA', agencyName: 'OSHA', titleNumber: '29', part: '1910', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-29/ECFR-title29.xml' }); }
    async syncOsha1926() { return this.syncRegulatoryPart({ agencyCode: 'OSHA', agencyName: 'OSHA', titleNumber: '29', part: '1926', bulkXmlUrl: 'https://www.govinfo.gov/bulkdata/ECFR/title-29/ECFR-title29.xml' }); }
};
exports.RegulatorySyncService = RegulatorySyncService;
exports.RegulatorySyncService = RegulatorySyncService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(regulatory_section_entity_1.RegulatorySection)),
    __param(1, (0, typeorm_1.InjectRepository)(regulatory_part_entity_1.RegulatoryPart)),
    __param(2, (0, typeorm_1.InjectRepository)(regulatory_agency_entity_1.RegulatoryAgency)),
    __param(3, (0, typeorm_1.InjectRepository)(regulatory_subpart_entity_1.RegulatorySubpart)),
    __param(4, (0, typeorm_1.InjectRepository)(regulatory_paragraph_entity_1.RegulatoryParagraph)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RegulatorySyncService);
//# sourceMappingURL=regulatory-sync.service.js.map