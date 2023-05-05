// @ts-check
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  // eslint-disable-next-line no-console
  console.warn(
    `\u001B[33mThis repository requires using pnpm as the package manager for scripts to work properly.\u001B[39m\n`
  );
  process.exit(1);
}
