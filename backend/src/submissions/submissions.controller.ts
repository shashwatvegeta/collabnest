import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';


@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Get()
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}

