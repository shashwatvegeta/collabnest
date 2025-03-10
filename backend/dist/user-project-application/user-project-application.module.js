"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_project_application_controller_1 = require("./user-project-application.controller");
const user_project_application_service_1 = require("./user-project-application.service");
const application_schema_1 = require("../application/application.schema");
const project_schema_1 = require("../project/project.schema");
let UserProjectApplicationModule = class UserProjectApplicationModule {
};
exports.UserProjectApplicationModule = UserProjectApplicationModule;
exports.UserProjectApplicationModule = UserProjectApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Application', schema: application_schema_1.ApplicationSchema },
                { name: 'Project', schema: project_schema_1.ProjectSchema },
            ]),
        ],
        controllers: [user_project_application_controller_1.UserProjectApplicationController],
        providers: [user_project_application_service_1.UserProjectApplicationService],
    })
], UserProjectApplicationModule);
//# sourceMappingURL=user-project-application.module.js.map