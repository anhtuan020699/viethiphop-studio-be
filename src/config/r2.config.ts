import { registerAs } from '@nestjs/config';

export default registerAs('r2', () => ({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_BUCKET_NAME,
  publicDomain: process.env.R2_PUBLIC_DOMAIN,
}));
