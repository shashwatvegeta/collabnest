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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mail_service_1 = require("../mail/mail.service");
let NotificationService = class NotificationService {
    notificationModel;
    mailService;
    constructor(notificationModel, mailService) {
        this.notificationModel = notificationModel;
        this.mailService = mailService;
    }
    async create(createNotificationDto) {
        const notification = new this.notificationModel(createNotificationDto);
        const savedNotification = await notification.save();
        if (createNotificationDto.email) {
            await this.mailService.sendNotificationEmail(createNotificationDto.email, createNotificationDto.title, createNotificationDto.message, createNotificationDto.data);
        }
        return savedNotification;
    }
    findAllByUser(userId) {
        return this.notificationModel.find({ recipient_id: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    markAsRead(id) {
        return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    }
    markAllAsRead(userId) {
        return this.notificationModel.updateMany({ recipient_id: userId, read: false }, { read: true }).exec();
    }
    remove(id) {
        return this.notificationModel.findByIdAndDelete(id).exec();
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model, typeof (_a = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _a : Object])
], NotificationService);
//# sourceMappingURL=notifiaction.service.js.map