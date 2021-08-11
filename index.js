const { readFileSync } = require('fs');
const { join } = require('path');
const { exec } = require('@actions/exec');

;(async () => {
  const cwd = join(process.env.GITHUB_WORKSPACE, '../');
  console.log('Step 1: Install Deps');
  await exec('npm i');

  console.log('Step 2: Install Deploy Tools');
  await exec('npm i @midwayjs/cli');

  let pkgJson = {};
  let cmd = `node -p 'require("${join(process.cwd(), 'node_modules/@midwayjs/cli/bin/cli.js')}").cli({ _: ["deploy"], yes: true, V: true })'`;
  let args = [];
  try {
    pkgJson = JSON.parse(readFileSync(join(cwd, 'package.json')).toString());
  } catch (e) {}

  if (pkgJson.scripts && pkgJson.scripts.deploy) {
    cmd = `npm run deploy`;
    args = [];
  }
  

  console.log('Step 3: Exec Deploy');
  await exec(`${cmd}`, args, {
    env: {
      SERVERLESS_DEPLOY_ID: process.env.INPUT_ID,
      SERVERLESS_DEPLOY_AK: process.env.INPUT_AK,
      SERVERLESS_DEPLOY_SECRET: process.env.INPUT_SECRET,
      SERVERLESS_DEPLOY_ENDPOINT: process.env.INPUT_ENDPOINT,
      SERVERLESS_DEPLOY_TIMEOUT: process.env.INPUT_TIMEOUT || '1000',
    }
  });
})();