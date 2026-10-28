import { ConflictException } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends ConflictException {
  constructor() {
    super(
      'A company with this email address is already registered. If you have not verified it yet, sign in and choose "Resend verification email".',
    );
  }
}
