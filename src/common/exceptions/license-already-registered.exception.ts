import { ConflictException } from '@nestjs/common';

export class LicenseAlreadyRegisteredException extends ConflictException {
  constructor() {
    super('A company with this license number is already registered.');
  }
}
