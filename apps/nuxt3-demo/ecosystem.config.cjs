module.exports = {
  apps: [
    {
      name: 'WebAppNext',
      exec_mode: 'cluster',
      instances: '20',
      script: './.output/server/index.mjs',
      max_memory_restart: '3584M',
      listen_timeout: 150000,
    },
  ],
};
