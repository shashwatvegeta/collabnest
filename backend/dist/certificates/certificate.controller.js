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
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const certificate_service_1 = require("./certificate.service");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const update_certificate_dto_1 = require("./dto/update-certificate.dto");
const mongoose_1 = require("mongoose");
class ValidateObjectId {
    transform(value) {
        const isValid = mongoose_1.Types.ObjectId.isValid(value);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid ObjectId');
        }
        return value;
    }
}
let CertificateController = class CertificateController {
    certificateService;
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    create(user_id, createCertificateDto) {
        return this.certificateService.create(user_id, createCertificateDto);
    }
    findAll(user_id) {
        return this.certificateService.findAll(user_id);
    }
    findOne(user_id, certificate_id) {
        return this.certificateService.findOne(user_id, certificate_id);
    }
    update(user_id, certificate_id, updateCertificateDto) {
        return this.certificateService.update(user_id, certificate_id, updateCertificateDto);
    }
    remove(user_id, certificate_id) {
        return this.certificateService.remove(user_id, certificate_id);
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('user_id', ValidateObjectId)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_certificate_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('user_id', ValidateObjectId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':certificate_id'),
    __param(0, (0, common_1.Param)('user_id', ValidateObjectId)),
    __param(1, (0, common_1.Param)('certificate_id', ValidateObjectId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':certificate_id'),
    __param(0, (0, common_1.Param)('user_id', ValidateObjectId)),
    __param(1, (0, common_1.Param)('certificate_id', ValidateObjectId)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_certificate_dto_1.UpdateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':certificate_id'),
    __param(0, (0, common_1.Param)('user_id', ValidateObjectId)),
    __param(1, (0, common_1.Param)('certificate_id', ValidateObjectId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "remove", null);
exports.CertificateController = CertificateController = __decorate([
    (0, common_1.Controller)('users/:user_id/certificates'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map