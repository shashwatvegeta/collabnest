"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const gamification_controller_1 = require("./gamification.controller");
const gamification_service_1 = require("./gamification.service");
const user_level_schema_1 = require("./schemas/user-level.schema");
let GamificationModule = class GamificationModule {
};
exports.GamificationModule = GamificationModule;
exports.GamificationModule = GamificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_level_schema_1.UserLevel.name, schema: user_level_schema_1.UserLevelSchema }
            ])
        ],
        controllers: [gamification_controller_1.GamificationController, gamification_controller_1.GamificationBulkController],
        providers: [gamification_service_1.GamificationService],
        exports: [gamification_service_1.GamificationService]
    })
], GamificationModule);
//# sourceMappingURL=gamification.module.js.map