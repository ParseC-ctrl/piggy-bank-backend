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
      instances: 'max',
      exec_mode: 'cluster', // 使用集群模式
      max_memory_restart: '500M', // 当内存使用超过 500M 时重启
    },
  ],
};
