import { Document, Types } from "mongoose";
export declare class Certificate extends Document {
    certificate_id: Types.ObjectId;
    project_id: Types.ObjectId;
    submission_id: Types.ObjectId;
    url: string;
    generated_at: Date;
}
export declare const CertificateSchema: import("mongoose").Schema<Certificate, import("mongoose").Model<Certificate, any, any, any, Document<unknown, any, Certificate> & Certificate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Certificate, Document<unknown, {}, import("mongoose").FlatRecord<Certificate>> & import("mongoose").FlatRecord<Certificate> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
