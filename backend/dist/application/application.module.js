"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const application_schema_1 = require("./application.schema");
const project_schema_1 = require("../project/project.schema");
const application_service_1 = require("./application.service");
const application_controller_1 = require("./application.controller");
const project_module_1 = require("../project/project.module");
const user_schema_1 = require("../user/user.schema");
const notifications_module_1 = require("../notifications/notifications.module");
const notifications_schema_1 = require("../notifications/notifications.schema");
let ApplicationModule = class ApplicationModule {
};
exports.ApplicationModule = ApplicationModule;
exports.ApplicationModule = ApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{
                    name: application_schema_1.Application.name,
                    schema: application_schema_1.ApplicationSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: project_schema_1.Project.name,
                    schema: project_schema_1.ProjectSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: notifications_schema_1.Notification.name,
                    schema: notifications_schema_1.NotificationsSchema
                }]),
            project_module_1.ProjectModule,
            notifications_module_1.NotificationsModule
        ],
        providers: [application_service_1.ApplicationsService],
        controllers: [application_controller_1.ApplicationsController]
    })
], ApplicationModule);
//# sourceMappingURL=application.module.js.map