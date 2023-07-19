import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_IMAGE,
  MAX_FILE_SIZE_VIDEO,
  UPLOAD_LOCATION,
} from './config';

export const fileConfig = (): Record<string, any> => ({
  aws_access_token: AWS_ACCESS_KEY_ID,
  aws_secret_key: AWS_SECRET_ACCESS_KEY,
  aws_region: AWS_REGION,
  aws_bucket_name: AWS_BUCKET_NAME,
  max_file_size: MAX_FILE_SIZE,
  max_file_size_image: MAX_FILE_SIZE_IMAGE,
  max_file_size_video: MAX_FILE_SIZE_VIDEO,
  upload_local: UPLOAD_LOCATION,
});
