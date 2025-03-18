import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(email: string) {
    return this.userModel.findOne({email: email}).exec();
  }

  update(user_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(user_id, updateUserDto, { new: true }).exec();
  }

  remove(user_id: string) {
    return this.userModel.findByIdAndDelete(user_id).exec();
  }
}