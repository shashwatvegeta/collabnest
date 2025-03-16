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
exports.SubmissionSchema = exports.Submissions = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Submissions = class Submissions extends mongoose_2.Document {
    user_id;
    submission_date;
    submission_message;
    files;
    feedback;
};
exports.Submissions = Submissions;
__decorate([
    (0, mongoose_1.Prop)({ ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Submissions.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Submissions.prototype, "submission_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Submissions.prototype, "submission_message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'File', required: true }),
    __metadata("design:type", Array)
], Submissions.prototype, "files", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Feedback', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Submissions.prototype, "feedback", void 0);
exports.Submissions = Submissions = __decorate([
    (0, mongoose_1.Schema)()
], Submissions);
exports.SubmissionSchema = mongoose_1.SchemaFactory.createForClass(Submissions);
//# sourceMappingURL=submissions.schema.js.map