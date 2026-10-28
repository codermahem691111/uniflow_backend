"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageInspector = exports.MAX_IMAGE_BYTES = void 0;
const common_1 = require("@nestjs/common");
exports.MAX_IMAGE_BYTES = 2 * 1024 * 1024;
let ImageInspector = class ImageInspector {
    inspect(file) {
        if (!file || !file.buffer || file.size === 0) {
            throw new common_1.BadRequestException('Please choose an image to upload.');
        }
        if (file.size > exports.MAX_IMAGE_BYTES) {
            throw new common_1.BadRequestException('The image must be 2 MB or smaller.');
        }
        const type = this.detect(file.buffer);
        if (!type) {
            throw new common_1.BadRequestException('Only JPEG, PNG or WebP images are allowed.');
        }
        return { buffer: file.buffer, ...type };
    }
    detect(buffer) {
        if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
            return { contentType: 'image/jpeg', extension: 'jpg' };
        }
        const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        if (buffer.length >= 8 && pngSignature.every((byte, index) => buffer[index] === byte)) {
            return { contentType: 'image/png', extension: 'png' };
        }
        const isRiff = buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF';
        if (isRiff && buffer.toString('ascii', 8, 12) === 'WEBP') {
            return { contentType: 'image/webp', extension: 'webp' };
        }
        return null;
    }
};
exports.ImageInspector = ImageInspector;
exports.ImageInspector = ImageInspector = __decorate([
    (0, common_1.Injectable)()
], ImageInspector);
//# sourceMappingURL=image-inspector.js.map