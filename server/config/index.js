const dotenv = require('dotenv');

dotenv.config();

const config = {
 MONGODB_DATABASE: process.env.DB_URL || 'mongodb://dinmaotutu:dinma1234@ds331145.mlab.com:31145/igr-transports',
 SUPERAGENT: process.env.SUPERAGENT || 07062313440,
 JWT_SECRET: process.env.JWT_SECRET
};

module.exports = config;