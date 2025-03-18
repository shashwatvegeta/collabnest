"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const project_schema_1 = require("./project/project.schema");
const project_module_1 = require("./project/project.module");
const application_module_1 = require("./application/application.module");
const task_module_1 = require("./task/task.module");
const user_module_1 = require("./user/user.module");
const achievement_module_1 = require("./achievements/achievement.module");
const certificate_module_1 = require("./certificates/certificate.module");
const submissions_module_1 = require("./submissions/submissions.module");
const submissions_schema_1 = require("./submissions/submissions.schema");
const discussion_module_1 = require("./discussion/discussion.module");
const discussionthread_module_1 = require("./discussionthread/discussionthread.module");
const feedback_module_1 = require("./feedback/feedback.module");
const notifications_module_1 = require("./notifications/notifications.module");
const meeting_module_1 = require("./meeting/meeting.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(`mongodb+srv://Random:NDZ3rKDH9gJDHy8b@collabnest.aut6a.mongodb.net/`),
            mongoose_1.MongooseModule.forFeature([{ name: "Project", schema: project_schema_1.ProjectSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: "Submissions", schema: submissions_schema_1.SubmissionSchema }]),
            project_module_1.ProjectModule,
            discussion_module_1.DiscussionModule,
            application_module_1.ApplicationModule,
            task_module_1.TaskModule,
            user_module_1.UserModule,
            achievement_module_1.AchievementModule,
            certificate_module_1.CertificateModule,
            submissions_module_1.SubmissionsModule,
            discussionthread_module_1.DiscussionThreadModule,
            feedback_module_1.FeedbackModule,
            notifications_module_1.NotificationsModule,
            meeting_module_1.MeetingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map