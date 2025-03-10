import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { CertificateSchema } from './certificate.schema';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Certificate', schema: CertificateSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}