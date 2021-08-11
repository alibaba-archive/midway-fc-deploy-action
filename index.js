const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

;(async () => {
  console.log('ENV', JSON.stringify(process.env, null, 2));
  const cwd = join(process.env.GITHUB_WORKSPACE, '../');
  console.log('Step 1: Install Deps');
  const lsRes = execSync(`cd ${cwd}; ls -al`);
  console.log(lsRes.toString());
  execSync(`cd ${cwd}; npm i`);

  console.log('Step 2: Install Deploy Tools');
  execSync(`cd ${cwd}; npm i @midwayjs/cli`);

  let pkgJson = {};
  let cmd = `npx mw deploy --yes -V`;
  try {
    pkgJson = JSON.parse(readFileSync(join(cwd, 'package.json')).toString());
  } catch (e) {}

  if (pkgJson.scripts && pkgJson.scripts.deploy) {
    cmd = `npm run deploy`;
  }

  console.log('Step 3: Exec Deploy');
  const deployRes = execSync(`cd ${cwd}; SERVERLESS_DEPLOY_ID=${process.env.INPUT_ID} SERVERLESS_DEPLOY_AK=${process.env.INPUT_AK} SERVERLESS_DEPLOY_SECRET=${process.env.INPUT_SECRET} SERVERLESS_DEPLOY_ENDPOINT=${process.env.INPUT_ENDPOINT || ''} SERVERLESS_DEPLOY_TIMEOUT=${process.env.INPUT_TIMEOUT || '1000'} ${cmd}`);
  console.log(deployRes.toString());
})();