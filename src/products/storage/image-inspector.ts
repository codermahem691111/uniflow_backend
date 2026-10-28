import { BadRequestException, Injectable } from '@nestjs/common';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB, same limit as the storage bucket

/** The parts of an uploaded file (from multer) that we use. */
export interface UploadedImageFile {
  buffer: Buffer;
  size: number;
}

export interface ValidatedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

/**
 * Checks an uploaded file by looking at its actual bytes, not at the file name or the
 * content type the browser claims, so a renamed file cannot sneak in.
 */
@Injectable()
export class ImageInspector {
  inspect(file: UploadedImageFile | undefined): ValidatedImage {
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException('Please choose an image to upload.');
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('The image must be 2 MB or smaller.');
    }

    const type = this.detect(file.buffer);
    if (!type) {
      throw new BadRequestException('Only JPEG, PNG or WebP images are allowed.');
    }

    return { buffer: file.buffer, ...type };
  }

  private detect(buffer: Buffer): { contentType: string; extension: string } | null {
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
}
