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
    synchronize:
      process.env.DATABASE_SYNCHRONIZE.toString().toLowerCase() === 'true',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
    sslEnabled:
      process.env.DATABASE_SSL_ENABLED.toString().toLowerCase() === 'true',
    rejectUnauthorized:
      process.env.DATABASE_REJECT_UNAUTHORIZED.toString().toLowerCase() ===
      'true',
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
  });

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${error.message}`,
    );
  }

  return values;
});
