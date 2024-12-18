import { registerAs } from '@nestjs/config';
import * as Joi from 'joi'

export default registerAs('mail', () => {

  
  const values = {
    port: parseInt(process.env.MAIL_PORT, 10),
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
  };

  // Joi validations
  const schema = Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    defaultEmail: Joi.string().required(),
    defaultName: Joi.string().required(),
    ignoreTLS: Joi.boolean().required(),
    secure: Joi.boolean().required(),
    requireTLS: Joi.boolean().required()
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
