const dotenv = require('dotenv');

dotenv.config();

const config = {
  MONGODB_DATABASE: process.env.DB_URL,
  DB_URL_PROD: process.env.DB_URL_PROD,
  SUPERAGENT: process.env.SUPERAGENT || 07062313440,
  JWT_SECRET: process.env.JWT_SECRET || "superagent",
  DB_URL: process.env.DB_URL,
  CLIENTID: process.env.CLIENTID,
  CLIENTKEY: process.env.CLIENTKEY,
  COMFIRMURL: process.env.COMFIRMURL,
  NINURL: process.env.NINURL,
  BVNTESTURL: process.env.BVNTESTURL,
  NINTESTURL: process.env.NINTESTURL,
  TESTCLIENTID: process.env.TESTCLIENTID,
  TESTCLIENTKEY: process.env.TESTCLIENTKEY,
  BANK_URL: process.env.BANK_URL,
  INNSTAPAY_SECRET_KEY_TEST: process.env.INNSTAPAY_SECRET_KEY_TEST
};

module.exports = config;