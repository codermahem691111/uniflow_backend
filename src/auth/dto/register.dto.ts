import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Lowercase, Trim, Uppercase } from '../../common/decorators/normalize.decorators';

export class RegisterDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Company name is required.' })
  @MaxLength(150, { message: 'Company name must be at most 150 characters.' })
  companyName!: string;

  @Trim()
  @Uppercase()
  @IsString()
  @IsNotEmpty({ message: 'License number is required.' })
  @MaxLength(50, { message: 'License number must be at most 50 characters.' })
  @Matches(/^[A-Z0-9][A-Z0-9\-\/ ]*$/, {
    message: 'License number may only contain letters, numbers, spaces, hyphens and slashes.',
  })
  licenseNumber!: string;

  @Trim()
  @Lowercase()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @MaxLength(254, { message: 'Email must be at most 254 characters.' })
  email!: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Owner name is required.' })
  @MaxLength(100, { message: 'Owner name must be at most 100 characters.' })
  ownerName!: string;

  @Trim()
  @IsString()
  @MinLength(10, { message: 'Business description must be at least 10 characters.' })
  @MaxLength(1000, { message: 'Business description must be at most 1000 characters.' })
  businessDescription!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(72, { message: 'Password must be at most 72 characters.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number.',
  })
  password!: string;
}
