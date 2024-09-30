import { join } from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
const configFileNameObj = {
  development: 'dev',
  production: 'prod',
};

const env = process.env.NODE_ENV;
export default () => {
  return yaml.load(
    fs.readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8'),
  ) as Record<string, any>;
};
