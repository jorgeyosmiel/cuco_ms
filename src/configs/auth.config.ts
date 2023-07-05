import {
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRATION,
} from './config';

export const authConfig = (): Record<string, string> => ({
  jwtSecretKey:
    JWT_SECRET_KEY ||
    'eyJhbGciOiJIUzI1NiJ9ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwMjINCn0',
  jwtExpiresIn: JWT_EXPIRES_IN || '2h',
  jwrRefreshExpiresIn: JWT_REFRESH_TOKEN_EXPIRATION || '2d',
});
