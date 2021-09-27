const path = require('path');
const envFile = path.resolve(__dirname, (process.env.NODE_ENV ? process.env.NODE_ENV : '')+'.env');
console.log(`config.js: using envFile=${envFile}`);

const dotenv = require('dotenv').config({ path: envFile }).parsed;

console.log(dotenv);


const config = {
  NODE_ENV: dotenv.NODE_ENV || 'development',
  HOST: dotenv.HOST || '127.0.0.1',
  PORT: dotenv.PORT || 3000,
  INTEGRATE_ANGULAR: (new RegExp(/-integrated/, 'i')).test(dotenv.NODE_ENV),
  PRODUCTION: (new RegExp(/^production/, 'i')).test(dotenv.NODE_ENV),
  NAME: dotenv.NAME || 'MEAN course project'
}

console.log(config);
module.exports = config;
