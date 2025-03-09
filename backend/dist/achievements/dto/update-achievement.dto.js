"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAchievementDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_achievement_dto_1 = require("./create-achievement.dto");
class UpdateAchievementDto extends (0, mapped_types_1.PartialType)(create_achievement_dto_1.CreateAchievementDto) {
}
exports.UpdateAchievementDto = UpdateAchievementDto;
//# sourceMappingURL=update-achievement.dto.js.map