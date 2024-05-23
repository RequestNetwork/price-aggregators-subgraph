#! /bin/bash

if [ "$1"  == "private" ]; then
  yarn codegen-local
  yarn create-local
  yarn deploy-local
  exit 0
fi

if [ -z "$DEPLOY_KEY" ]; then
  echo "DEPLOY_KEY is required";
  exit 1;
fi
if [ -z "$1" ]; then
  echo "The chain is missing. Example: $0 sepolia"
  exit 1;
fi

echo "Deploying price-aggregators-$1"

yarn run graph codegen "./subgraph.$1.yaml"
yarn run graph deploy --studio "price-aggregators-$1"  --deploy-key "$DEPLOY_KEY" "./subgraph.$1.yaml"
