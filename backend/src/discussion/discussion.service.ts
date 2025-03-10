import { Injectable } from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Discussion } from './discussion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class DiscussionService {
  constructor(@InjectModel('Discussion') private projectModel: Model<Discussion>) { }
  create(createDiscussionDto: CreateDiscussionDto) {
    const createdDiscussion = new this.projectModel(createDiscussionDto);
    return createdDiscussion.save();
  }

  findAll() {
    return this.projectModel.find().exec();
  }

  findOne(id: number) {
    return this.projectModel.findById(id).exec;
  }

  update(id: number, updateDiscussionDto: UpdateDiscussionDto) {
    return this.projectModel.findByIdAndUpdate(id, updateDiscussionDto, { new: true }).exec();
  }

  remove(id: number) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}


