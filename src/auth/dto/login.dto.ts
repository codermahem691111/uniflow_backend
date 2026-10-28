import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Lowercase, Trim } from '../../common/decorators/normalize.decorators';

export class LoginDto {
  @Trim()
  @Lowercase()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password!: string;
}
