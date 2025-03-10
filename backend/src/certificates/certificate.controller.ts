import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Types } from 'mongoose';

// Custom pipe for ObjectId validation
class ValidateObjectId {
  transform(value: string): string {
    const isValid = Types.ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}

@Controller('users/:user_id/certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  create(
    @Param('user_id', ValidateObjectId) user_id: string,
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    return this.certificateService.create(user_id, createCertificateDto);
  }

  @Get()
  findAll(@Param('user_id', ValidateObjectId) user_id: string) {
    return this.certificateService.findAll(user_id);
  }

  @Get(':certificate_id')
  findOne(
    @Param('user_id', ValidateObjectId) user_id: string,
    @Param('certificate_id', ValidateObjectId) certificate_id: string,
  ) {
    return this.certificateService.findOne(user_id, certificate_id);
  }

  @Put(':certificate_id')
  update(
    @Param('user_id', ValidateObjectId) user_id: string,
    @Param('certificate_id', ValidateObjectId) certificate_id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(user_id, certificate_id, updateCertificateDto);
  }

  @Delete(':certificate_id')
  remove(
    @Param('user_id', ValidateObjectId) user_id: string,
    @Param('certificate_id', ValidateObjectId) certificate_id: string,
  ) {
    return this.certificateService.remove(user_id, certificate_id);
  }
}