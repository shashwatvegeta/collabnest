import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate } from './certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { User } from '../user/user.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel('Certificate') private certificateModel: Model<Certificate>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(user_id: string, createCertificateDto: CreateCertificateDto) {
    // Verify user exists
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Set generated_at date if not provided
    if (!createCertificateDto.generated_at) {
      createCertificateDto.generated_at = new Date();
    }

    const createdCertificate = new this.certificateModel(createCertificateDto);
    const savedCertificate = await createdCertificate.save();
    
    // Add certificate to user's certificates array
    await this.userModel.findByIdAndUpdate(
      user_id,
      { $push: { certificates: savedCertificate._id } },
      { new: true }
    ).exec();
    
    return savedCertificate;
  }

  async findAll(user_id: string) {
    const user = await this.userModel.findById(user_id)
      .populate('certificates')
      .exec();
      
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    return user.certificates;
  }

  async findOne(user_id: string, certificate_id: string) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    const certificate = await this.certificateModel.findById(certificate_id)
      .populate('project_id')
      .exec();
      
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${certificate_id} not found`);
    }
    
    return certificate;
  }

  async update(user_id: string, certificate_id: string, updateCertificateDto: UpdateCertificateDto) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    // Check if certificate exists and belongs to the user
    const certificate = await this.certificateModel.findByIdAndUpdate(
      certificate_id, 
      updateCertificateDto,
      { new: true }
    ).exec();
    
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${certificate_id} not found`);
    }
    
    return certificate;
  }

  async remove(user_id: string, certificate_id: string) {
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    
    const deletedCertificate = await this.certificateModel.findByIdAndDelete(certificate_id).exec();
    if (!deletedCertificate) {
      throw new NotFoundException(`Certificate with ID ${certificate_id} not found`);
    }
    
    // Remove certificate from user's certificates array
    await this.userModel.findByIdAndUpdate(
      user_id,
      { $pull: { certificates: certificate_id } }
    ).exec();
    
    return deletedCertificate;
  }
}