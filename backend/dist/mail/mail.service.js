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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get('MAIL_PORT', 587),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }
    async sendNotificationEmail(to, subject, text, data) {
        let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${subject}</h2>
        <p>${text}</p>
    `;
        if (data && data.project_name) {
            htmlContent += `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3>Project Details</h3>
          <p><strong>Name:</strong> ${data.project_name}</p>
          ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
        </div>
      `;
        }
        if (data && data.applicant_name) {
            htmlContent += `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3>Applicant Information</h3>
          <p><strong>Name:</strong> ${data.applicant_name}</p>
          ${data.applicant_email ? `<p><strong>Email:</strong> ${data.applicant_email}</p>` : ''}
        </div>
      `;
        }
        if (data && data.action_url) {
            htmlContent += `
        <div style="margin-top: 30px; text-align: center;">
          <a href="${data.action_url}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${data.action_text || 'View Details'}
          </a>
        </div>
      `;
        }
        htmlContent += `</div>`;
        const info = await this.transporter.sendMail({
            from: `"Project Management System" <${this.configService.get('MAIL_FROM', this.configService.get('MAIL_USER'))}>`,
            to,
            subject,
            text,
            html: htmlContent,
        });
        return info;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MailService);
//# sourceMappingURL=mail.service.js.map