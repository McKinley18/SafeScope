"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlVerificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const control_verification_entity_1 = require("./entities/control-verification.entity");
const control_verifications_service_1 = require("./control-verifications.service");
const control_verifications_controller_1 = require("./control-verifications.controller");
let ControlVerificationsModule = class ControlVerificationsModule {
};
exports.ControlVerificationsModule = ControlVerificationsModule;
exports.ControlVerificationsModule = ControlVerificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([control_verification_entity_1.ControlVerification])],
        providers: [control_verifications_service_1.ControlVerificationsService],
        controllers: [control_verifications_controller_1.ControlVerificationsController],
        exports: [control_verifications_service_1.ControlVerificationsService],
    })
], ControlVerificationsModule);
//# sourceMappingURL=control-verifications.module.js.map