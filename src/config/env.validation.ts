import { plainToInstance, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUrl, Matches, Min, validateSync } from 'class-validator';

const URL_OPTIONS = { protocols: ['http', 'https'], require_protocol: true, require_tld: false };
const PUBLISHABLE_KEY_PATTERN = /^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;
const SECRET_KEY_PATTERN = /^(sb_secret_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;

export class EnvironmentVariables {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT: number = 3000;

  @IsUrl(URL_OPTIONS, {
    message: 'FRONTEND_URL must be a full URL, for example http://localhost:5173',
  })
  FRONTEND_URL!: string;

  @IsUrl(URL_OPTIONS, {
    message:
      'SUPABASE_URL must be the Project URL, for example https://your-project-ref.supabase.co (not the postgresql:// connection string)',
  })
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty({ message: 'SUPABASE_PUBLISHABLE_KEY is required (Project Settings -> API Keys)' })
  @Matches(PUBLISHABLE_KEY_PATTERN, {
    message:
      'SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key (sb_publishable_...) or legacy anon JWT from this project',
  })
  SUPABASE_PUBLISHABLE_KEY!: string;

  @IsString()
  @IsNotEmpty({ message: 'SUPABASE_SERVICE_ROLE_KEY is required (Project Settings -> API Keys)' })
  @Matches(SECRET_KEY_PATTERN, {
    message:
      'SUPABASE_SERVICE_ROLE_KEY must be a Supabase secret key (sb_secret_...) or legacy service_role JWT from this project',
  })
  SUPABASE_SERVICE_ROLE_KEY!: string;
}

export function validateEnv(rawConfig: Record<string, unknown>): EnvironmentVariables {
  const config = plainToInstance(EnvironmentVariables, rawConfig);
  const errors = validateSync(config);

  if (errors.length > 0) {
    const details = errors
      .map((error) => `  - ${Object.values(error.constraints ?? {}).join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration (check your .env file):\n${details}`);
  }

  return config;
}
