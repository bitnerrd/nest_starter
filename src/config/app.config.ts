import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('app', () => {
  const values = {
    nodeEnv: process.env.NODE_ENV,
    name: process.env.APP_NAME,
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    adminPanelDomain: process.env.ADMIN_PANEL_FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN,
    port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  };

  // Joi validations
  const schema = Joi.object({
    nodeEnv: Joi.string()
      .required()
      .valid('development', 'production', 'testing')
      .default('development'),
    name: Joi.string().required(),
    workingDirectory: Joi.string(),
    frontendDomain: Joi.string().allow(null, ''),
    adminPanelDomain: Joi.string().allow(null, ''),
    backendDomain: Joi.string().allow(null, ''),
    port: Joi.number().required(),
    apiPrefix: Joi.string().required(),
    fallbackLanguage: Joi.string().required(),
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
