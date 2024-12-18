import { registerAs } from '@nestjs/config';
import { AuthConfig } from 'src/auth/config/auth.config';
import * as Joi from 'joi';

export default registerAs('auth', () => {
  const accessTokenValues = {
    secret: process.env.AUTH_ACCESSTOKEN_SECRET,
    expiration: process.env.AUTH_ACCESSTOKEN_EXPIRATION,
  };

  const refreshTokenValues = {
    secret: process.env.AUTH_REFRESHTOKEN_SECRET,
    expiration: process.env.AUTH_REFRESHTOKEN_EXPIRATION,
  };

  const schema = Joi.object({
    secret: Joi.string().required(),
    expiration: Joi.string(),
  });

  const accessTokenValidations = schema.validate(accessTokenValues, {
    abortEarly: false,
  });

  if (accessTokenValidations.error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${accessTokenValidations.error.message}`,
    );
  }

  const refreshTokenValidations = schema.validate(refreshTokenValues, {
    abortEarly: false,
  });

  if (refreshTokenValidations.error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${refreshTokenValidations.error.message}`,
    );
  }

  return {
    accessToken: {
      ...accessTokenValues,
    },
    refreshToken: {
      ...refreshTokenValues,
    },
  } as AuthConfig;
});
