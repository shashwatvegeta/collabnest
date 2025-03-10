"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementSchema = exports.Achievement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Achievement = class Achievement extends mongoose_2.Document {
    achievement_id;
    skills_id;
    projects_id;
};
exports.Achievement = Achievement;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Achievement.prototype, "achievement_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Skill' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Achievement.prototype, "skills_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Project' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Achievement.prototype, "projects_id", void 0);
exports.Achievement = Achievement = __decorate([
    (0, mongoose_1.Schema)()
], Achievement);
exports.AchievementSchema = mongoose_1.SchemaFactory.createForClass(Achievement);
//# sourceMappingURL=achievement.schema.js.map