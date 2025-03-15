export declare class CreateNotificationDto {
    recipient_id: string;
    type: string;
    title: string;
    message: string;
    email?: string;
    data?: Record<string, any>;
}
