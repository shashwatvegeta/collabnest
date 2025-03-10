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
exports.CertificateService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CertificateService = class CertificateService {
    certificateModel;
    userModel;
    constructor(certificateModel, userModel) {
        this.certificateModel = certificateModel;
        this.userModel = userModel;
    }
    async create(user_id, createCertificateDto) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        if (!createCertificateDto.generated_at) {
            createCertificateDto.generated_at = new Date();
        }
        const createdCertificate = new this.certificateModel(createCertificateDto);
        const savedCertificate = await createdCertificate.save();
        await this.userModel.findByIdAndUpdate(user_id, { $push: { certificates: savedCertificate._id } }, { new: true }).exec();
        return savedCertificate;
    }
    async findAll(user_id) {
        const user = await this.userModel.findById(user_id)
            .populate('certificates')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        return user.certificates;
    }
    async findOne(user_id, certificate_id) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const certificate = await this.certificateModel.findById(certificate_id)
            .populate('project_id')
            .exec();
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${certificate_id} not found`);
        }
        return certificate;
    }
    async update(user_id, certificate_id, updateCertificateDto) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const certificate = await this.certificateModel.findByIdAndUpdate(certificate_id, updateCertificateDto, { new: true }).exec();
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${certificate_id} not found`);
        }
        return certificate;
    }
    async remove(user_id, certificate_id) {
        const user = await this.userModel.findById(user_id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        const deletedCertificate = await this.certificateModel.findByIdAndDelete(certificate_id).exec();
        if (!deletedCertificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${certificate_id} not found`);
        }
        await this.userModel.findByIdAndUpdate(user_id, { $pull: { certificates: certificate_id } }).exec();
        return deletedCertificate;
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Certificate')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map