"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCertificateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_certificate_dto_1 = require("./create-certificate.dto");
class UpdateCertificateDto extends (0, mapped_types_1.PartialType)(create_certificate_dto_1.CreateCertificateDto) {
}
exports.UpdateCertificateDto = UpdateCertificateDto;
//# sourceMappingURL=update-certificate.dto.js.map