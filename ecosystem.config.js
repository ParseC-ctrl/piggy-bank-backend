module.exports = {
  apps: [
    {
      name: 'piggy-bank-backend',
      script: './dist/main.js',
      watch: true,
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
