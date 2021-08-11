# midway-fc-deploy-action
midway fc deploy action

## Usage
```yaml
# This is a basic workflow to help you get started with Actions

name: midwayAutoDeploy

# Controls when the action will run. 
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: midway-fc-deploy-action
        uses: midwayjs/midway-fc-deploy-action@v1
        with:
          id: ${{ secrets.SERVERLESS_DEPLOY_ID }}
          ak: ${{ secrets.SERVERLESS_DEPLOY_AK }}
          secret: ${{ secrets.SERVERLESS_DEPLOY_SECRET }}
```