const dotenv = require('dotenv');

dotenv.config();

const config = {
 MONGODB_DATABASE: process.env.DB_URL,
 SUPERAGENT: process.env.SUPERAGENT || 07062313440,
 JWT_SECRET: process.env.JWT_SECRET || 'superagent'
};

module.exports = config;