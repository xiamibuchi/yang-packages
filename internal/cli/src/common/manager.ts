/* eslint-disable no-console */
import { execa } from 'execa';
import { consola } from './logger.js';

function getPackageManager() {
  return 'pnpm';
}

export async function installDependencies() {
  consola.info('Install Dependencies\n');

  try {
    const manager = getPackageManager();

    await execa(manager, ['install', '--prod=false'], {
      stdio: 'inherit',
    });

    console.log('');
  } catch (err) {
    console.log(err);
    throw err;
  }
}
