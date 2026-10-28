import { IsEmail } from 'class-validator';
import { Lowercase, Trim } from '../../common/decorators/normalize.decorators';

export class ResendVerificationDto {
  @Trim()
  @Lowercase()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;
}
