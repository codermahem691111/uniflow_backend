/** A signed-in or registering user, as Supabase Auth knows them. */
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInResult {
  user: AuthUser;
  tokens: SessionTokens;
}
