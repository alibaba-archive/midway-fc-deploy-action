const { readFileSync } = require('fs');
const { join } = require('path');
const { exec } = require('@actions/exec');
const { execSync } = require('child_process');

;(async () => {
  const cwd = process.cwd();
  console.log('Step 1: Install Deps');
  await exec('npm i');

  console.log('Step 2: Install Deploy Tools');
  await exec('npm i @midwayjs/cli');

  let pkgJson = {};
  let cmd = `npx node deploy --yes -V`;
  let args = [];
  try {
    pkgJson = JSON.parse(readFileSync(join(cwd, 'package.json')).toString());
  } catch (e) {}

  if (pkgJson.scripts && pkgJson.scripts.deploy) {
    cmd = `npm run deploy`;
    args = [];
  }

  

  console.log('Step 3: Exec Deploy');
  const res = execSync(`SERVERLESS_DEPLOY_ID=${process.env.INPUT_ID} SERVERLESS_DEPLOY_AK=${process.env.INPUT_AK} SERVERLESS_DEPLOY_SECRET=${process.env.INPUT_SECRET} SERVERLESS_DEPLOY_ENDPOINT=${process.env.INPUT_ENDPOINT} SERVERLESS_DEPLOY_TIMEOUT=${process.env.INPUT_TIMEOUT || '1000'} ${cmd}`);
  console.log(res.toString());
  
  // await exec(`${cmd}`, args, {
  //   env: {
  //     SERVERLESS_DEPLOY_ID: process.env.INPUT_ID,
  //     SERVERLESS_DEPLOY_AK: process.env.INPUT_AK,
  //     SERVERLESS_DEPLOY_SECRET: process.env.INPUT_SECRET,
  //     SERVERLESS_DEPLOY_ENDPOINT: process.env.INPUT_ENDPOINT,
  //     SERVERLESS_DEPLOY_TIMEOUT: process.env.INPUT_TIMEOUT || '1000',
  //   }
  // });
})();