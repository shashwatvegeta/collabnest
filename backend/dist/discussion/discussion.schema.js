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
exports.DiscussionSchema = exports.Discussion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Discussion = class Discussion extends mongoose_2.Document {
    title;
    discussion_id;
    Projects;
    description;
    created_by;
    Discussion_Replies;
};
exports.Discussion = Discussion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Discussion.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ _id: true }),
    __metadata("design:type", Array)
], Discussion.prototype, "discussion_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Discussion.prototype, "Projects", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Discussion.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Discussion.prototype, "created_by", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Discussion.prototype, "Discussion_Replies", void 0);
exports.Discussion = Discussion = __decorate([
    (0, mongoose_1.Schema)()
], Discussion);
exports.DiscussionSchema = mongoose_1.SchemaFactory.createForClass(Discussion);
//# sourceMappingURL=discussion.schema.js.map