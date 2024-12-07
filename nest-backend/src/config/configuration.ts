// import types
import { ConfigType } from './configuration.interface';

// env
import * as dotenv from 'dotenv';
dotenv.config();

export const Configuration: ConfigType = {
  // mongodb
  DB_NAME: process.env.DB_NAME,
  DB_URL: process.env.MONGODB_URI || '',

  // api port
  PORT: process.env.PORT ? Number(process.env.PORT) : 3333,

  // email for auth
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // redis
  REDIS_URL: process.env.REDIS_URL,

  // ui route
  UI_ROUTE: process.env.UI_ROUTE,

  // jwt
  JWT_SECRET: process.env.JWT_SECRET,
};
