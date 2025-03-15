import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendNotificationEmail(to: string, subject: string, text: string, data?: Record<string, any>): Promise<any>;
}
