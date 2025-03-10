import { Model } from 'mongoose';
import { Certificate } from './certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { User } from '../user/user.schema';
export declare class CertificateService {
    private certificateModel;
    private userModel;
    constructor(certificateModel: Model<Certificate>, userModel: Model<User>);
    create(user_id: string, createCertificateDto: CreateCertificateDto): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(user_id: string): Promise<object[]>;
    findOne(user_id: string, certificate_id: string): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(user_id: string, certificate_id: string, updateCertificateDto: UpdateCertificateDto): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(user_id: string, certificate_id: string): Promise<import("mongoose").Document<unknown, {}, Certificate> & Certificate & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
