"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_projects_controller_1 = require("./user-projects.controller");
const user_projects_service_1 = require("./user-projects.service");
const project_schema_1 = require("../project/project.schema");
let UserProjectsModule = class UserProjectsModule {
};
exports.UserProjectsModule = UserProjectsModule;
exports.UserProjectsModule = UserProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Project', schema: project_schema_1.ProjectSchema }]),
        ],
        controllers: [user_projects_controller_1.UserProjectsController],
        providers: [user_projects_service_1.UserProjectsService],
    })
], UserProjectsModule);
//# sourceMappingURL=user-projects.module.js.map