import { config as dotenvConfig } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenvConfig();
}

const config = {
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
  PORT: 8080,
  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    domain: process.env.AUTH0_DOMAIN,
  },
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
