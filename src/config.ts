const config = {
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
  PORT: 8080,
  AUTH0: {
    audience: process.env.AUTH0_AUDIENCE,
    domain: process.env.AUTH0_DOMAIN,
  },
};

export default config;
