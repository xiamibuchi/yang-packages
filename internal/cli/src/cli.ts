import { Command } from 'commander';

const program = new Command();

program
  .command('build')
  .description('Compile components in production mode')
  .action(async () => {
    const { build } = await import('./commands/build.js');
    return build();
  });

program.parse();
