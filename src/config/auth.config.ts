import { registerAs } from '@nestjs/config';
import { AuthConfig } from 'src/auth/config/auth.config';
import * as Joi from 'joi'


export default registerAs('auth', () => {
    const accessTokenValues = {
        secret: process.env.AUTH_ACCESSTOKEN_SECRET,
        expiration: process.env.AUTH_ACCESSTOKEN_EXPIRATION
    }

    const refreshTokenValues = {
        secret: process.env.AUTH_REFRESHTOKEN_SECRET,
        expiration: process.env.AUTH_REFRESHTOKEN_EXPIRATION
    }

    // Joi validations
    const schema = Joi.object({
        secret: Joi.string().required(),
        expiration: Joi.string(),
    });


    // Validates our values using the schema.
    // Passing a flag to tell Joi to not stop validation on the
    // first error, we want all the errors found.
    const accessTokenValidations = schema.validate(accessTokenValues, { abortEarly: false });

    // If the validation is invalid, "error" is assigned a
    // ValidationError object providing more information.
    if (accessTokenValidations.error) {
        throw new Error(
            `Validation failed - Is there an environment variable missing?
        ${accessTokenValidations.error.message}`,
        );
    }

    const refreshTokenValidations = schema.validate(refreshTokenValues, { abortEarly: false });

    // If the validation is invalid, "error" is assigned a
    // ValidationError object providing more information.
    if (refreshTokenValidations.error) {
        throw new Error(
            `Validation failed - Is there an environment variable missing?
        ${refreshTokenValidations.error.message}`,
        );
    }

    // If the validation is valid, then the "error" will be
    // undefined and this will return successfully.
    return ({
        accessToken: {
            ...accessTokenValues
        },
        refreshToken: {
            ...refreshTokenValues
        },
    } as AuthConfig);
})