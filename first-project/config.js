const path = require('path');
const envFile = path.resolve(__dirname, (process.env.NODE_ENV ? process.env.NODE_ENV : '')+'.env');
console.log(`config.js: using envFile=${envFile}`);

const dotenv = require('dotenv').config({ path: envFile }).parsed;

console.log(dotenv);

module.exports = {
  NODE_ENV: dotenv.NODE_ENV || 'development',
  HOST: dotenv.HOST || '127.0.0.1',
  PORT: dotenv.PORT || 3000,
  INTEGRATE_ANGULAR: (dotenv.INTEGRATE_ANGULAR == 'true'),
  NAME: 'MEAN course project'
}
