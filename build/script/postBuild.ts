// #!/usr/bin/env node

import { runBuildConfig } from './buildConf';
// import { OUTPUT_DIR, TEST_SERVER_ADDR } from '../constant';
import chalk from 'chalk';

import pkg from '../../package.json';
// const child_process = require('child_process');

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2);

    // Generate configuration file
    if (!argvList.includes('disabled-config')) {
      runBuildConfig();
    }

    console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
    process.exit(1);
  }
};
runBuild();
