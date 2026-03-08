const process = require('node:process');

const nodeMajor = Number(process.version.slice(1).split('.')[0]);
if (nodeMajor < 24) {
  console.error(
    '\x1B[31mThis repository requires Node.js >= 24 (current: %s).\x1B[39m\n',
    process.version,
  );
  process.exit(1);
}

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.error(
    '\x1B[31mThis repository requires pnpm. Run: corepack enable && pnpm install\x1B[39m\n',
  );
  process.exit(1);
}
