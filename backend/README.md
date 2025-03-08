# CollabNest Backend

## Setting up the project
* Clone the repo
* Install dependencies
```
npm install
```
* Install the Nest js cli
```
npm install -g @nestjs/cli
```

## Creating an endpoint
* First, create a resource (i.e, the entity to be dealt with)
```
nest g resource <resource_name>
```
* Inside the newly created folder, create a schema for the resource.
``<resource>.schema.ts``
```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema()
export class Project extends Document {
  @Prop({ required: true })
  project_name: string;
  @Prop({ _id: true })
  project_id: number;
  @Prop()
  description: string;
  @Prop()
  is_completed: boolean;
  @Prop()
  cap: number;
  @Prop()
  start_date: Date;
  @Prop()
  end_date: Date;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
```
* Add the entity in ``app.module.ts``
```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project/project.schema";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      `${connection_url}`,
    ),
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]), // THIS LINE HERE! Enter the resource's name for 'name'
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```
* Set up the DTO and entity definitions for the resource
``dto/create-<resource>.dto.ts``
```typescript
export class CreateProjectDto {
  project_name: string;
  project_id: number;
  description: string;
  cap: number;
  start_date: Date;
  end_date: Date;
  project_owner: Object;
}
```
``entities/<resource>.entity.ts``
```typescript
export class Project {
  name: string;
  project_id: number;
  is_approved: boolean;
  description: string;
  is_completed: boolean;
  cap: number;
  start_date: Date;
  end_date: Date;
  discussion_threads: Object[];
  tags: Object[];
  project_owner: number;
  students_enrolled: Object[];
  tasks: Object[];
  project_application: Object[];
}
```
* Now update ``<resource>.service.ts`` to use Mongoose
```typescript
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) { } // Make sure to inject the Model dependency
  create(createProjectDto: CreateProjectDto) {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  findAll() {
    return this.projectModel.find().exec();
  }

  findOne(id: number) {
    return this.projectModel.findById(id).exec();
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true }).exec();
  }

  remove(id: number) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
```
* Add the Mongoose module in ``<resource>.module.ts``
```typescript
import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectSchema } from "./project.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Project", schema: ProjectSchema }]), // This
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule { }
```
