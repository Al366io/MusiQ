// this config file is needed to read the .env variables
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;
module.exports = envs;
