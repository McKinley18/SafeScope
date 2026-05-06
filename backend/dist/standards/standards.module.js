"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const standards_controller_1 = require("./standards.controller");
const standards_service_1 = require("./standards.service");
const standard_entity_1 = require("./entities/standard.entity");
const standard_match_feedback_entity_1 = require("./entities/standard-match-feedback.entity");
let StandardsModule = class StandardsModule {
};
exports.StandardsModule = StandardsModule;
exports.StandardsModule = StandardsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([standard_entity_1.Standard, standard_match_feedback_entity_1.StandardMatchFeedback])],
        controllers: [standards_controller_1.StandardsController],
        providers: [standards_service_1.StandardsService],
        exports: [standards_service_1.StandardsService],
    })
], StandardsModule);
//# sourceMappingURL=standards.module.js.map