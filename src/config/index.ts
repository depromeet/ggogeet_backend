// import { dbConfig } from './database';

const isProd = process.env.NODE_ENV === "production";

const CDN = isProd ? process.env.CDN_HOST : process.env.DEV_CDN_HOST;

interface IConfig {}

export default (): Partial<IConfig> => ({
  isProd: isProd,
  PORT: parseInt(process.env.PORT || "8080", 10),
  CDN: CDN
  // database: dbConfig(),
})