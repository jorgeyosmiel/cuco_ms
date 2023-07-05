import {
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRATION,
} from './config';

export const authConfig = (): Record<string, string> => ({
  jwtSecretKey: JWT_SECRET_KEY,
  jwtExpiresIn: JWT_EXPIRES_IN,
  jwrRefreshExpiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
});
