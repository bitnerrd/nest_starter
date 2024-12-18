import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('database', () => {

  const values = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE.toString().toLowerCase() === 'true',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED.toString().toLowerCase() === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED.toString().toLowerCase() === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };

  // Joi validations
  const schema = Joi.object({
    type: Joi.string().required().valid('mysql', 'postgres'),
    host: Joi.string().required().default('localhost'),
    port: Joi.number().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    synchronize: Joi.boolean().required(),
    maxConnections: Joi.number().required(),
    sslEnabled: Joi.boolean(),
    rejectUnauthorized: Joi.boolean(),
    ca: Joi.string().allow(null, ''),
    key: Joi.string().allow(null, ''),
    cert: Joi.string().allow(null, ''),
  });


  // Validates our values using the schema.
  // Passing a flag to tell Joi to not stop validation on the
  // first error, we want all the errors found.
  const { error } = schema.validate(values, { abortEarly: false });

  // If the validation is invalid, "error" is assigned a
  // ValidationError object providing more information.
  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${error.message}`,
    );
  }

  // If the validation is valid, then the "error" will be
  // undefined and this will return successfully.
  return values;
});
