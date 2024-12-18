import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';


export default registerAs('file', () => {

  const values = {
    driver: process.env.FILE_DRIVER,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
    awsS3Region: process.env.AWS_S3_REGION,
    firebaseConfigFilePath: process.env.FIREBASE_CONFIG_FILE_PATH,
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  };

  // Joi validations
  const schema = Joi.object({
    driver: Joi.string().required(),
    accessKeyId: Joi.string().allow(null, ''),
    secretAccessKey: Joi.string().allow(null, ''),
    awsDefaultS3Bucket: Joi.string().allow(null, ''),
    awsDefaultS3Url: Joi.string().allow(null, ''),
    awsS3Region: Joi.string().allow(null, ''),
    firebaseConfigFilePath: Joi.string().allow(null, ''),
    maxFileSize: Joi.number().required(), // 10MB
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
// export default registerAs('file', () => ({
//   driver: process.env.FILE_DRIVER,
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
//   awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
//   awsS3Region: process.env.AWS_S3_REGION,
//   firebaseConfigFilePath: process.env.FIREBASE_CONFIG_FILE_PATH,
//   maxFileSize: 5242880, // 5mb
// }));
