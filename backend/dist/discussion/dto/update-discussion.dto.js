"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiscussionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_discussion_dto_1 = require("./create-discussion.dto");
class UpdateDiscussionDto extends (0, mapped_types_1.PartialType)(create_discussion_dto_1.CreateDiscussionDto) {
}
exports.UpdateDiscussionDto = UpdateDiscussionDto;
//# sourceMappingURL=update-discussion.dto.js.map