import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    create(user_id: string, createCertificateDto: CreateCertificateDto): Promise<import("mongoose").Document<unknown, {}, import("./certificate.schema").Certificate> & import("./certificate.schema").Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(user_id: string): Promise<object[]>;
    findOne(user_id: string, certificate_id: string): Promise<import("mongoose").Document<unknown, {}, import("./certificate.schema").Certificate> & import("./certificate.schema").Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(user_id: string, certificate_id: string, updateCertificateDto: UpdateCertificateDto): Promise<import("mongoose").Document<unknown, {}, import("./certificate.schema").Certificate> & import("./certificate.schema").Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(user_id: string, certificate_id: string): Promise<import("mongoose").Document<unknown, {}, import("./certificate.schema").Certificate> & import("./certificate.schema").Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
