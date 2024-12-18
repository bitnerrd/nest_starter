export interface AuthConfig {
  accessToken: TokenConfig;
  refreshToken: TokenConfig;
}

export interface TokenConfig {
  secret: string;
  expiration: string | number | undefined;
}
