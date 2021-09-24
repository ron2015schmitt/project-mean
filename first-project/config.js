const dotenv = require('dotenv');
const path = require('path');
const envFile = path.resolve(__dirname, (process.env.NODE_ENV ? process.env.NODE_ENV : '')+'.env');

console.log(`config.js: using envFile=${envFile}`);

dotenv.config({
  path: envFile,
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,
  INTEGRATE_ANGULAR: (process.env.INTEGRATE_ANGULAR == true),
  NAME: 'MEAN course project'
}
