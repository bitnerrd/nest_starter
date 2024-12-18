import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('stripe', () => {
  const values = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeCurrency: process.env.STRIPE_CURRENCY,
    stripeAPIVersion: process.env.STRIPE_API_VERSION,
  };

  // Joi validations
  const schema = Joi.object({
    stripeSecretKey: Joi.string().required(),
    stripeCurrency: Joi.string().required(),
    stripeAPIVersion: Joi.string().required(),
  });

  // Validates our values using the schema.
  // Passing a flag to tell Joi to not stop validation on the
  // first error, we want all the errors found.

  // const { error } = schema.validate(values, { abortEarly: false });

  // If the validation is invalid, "error" is assigned a
  // ValidationError object providing more information.
  const error: any = false;
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
