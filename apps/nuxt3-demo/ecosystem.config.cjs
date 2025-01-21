module.exports = {
  apps: [
    {
      name: 'WebAppNext',
      exec_mode: 'cluster',
      instances: 'max - 1',
      script: './.output/server/index.mjs',
      max_memory_restart: '3584M',
      listen_timeout: 150000,
    },
  ],
};
