module.exports = {
  apps: [
    {
      name: 'couponbeee-production',
      script: 'server.ts',
      interpreter: 'tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
