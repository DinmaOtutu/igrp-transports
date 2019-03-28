const dotenv = require('dotenv');

dotenv.config();

const config = {
 MONGODB_DATABASE: process.env.DB_URL,
 DB_URL_PROD:process.env.DB_URL_PROD,
 SUPERAGENT: process.env.SUPERAGENT || 07062313440,
 JWT_SECRET: process.env.JWT_SECRET || 'superagent',
 DB_URL:     process.env.DB_URL
};

module.exports = config;