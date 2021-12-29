#! /bin/bash


if [ "$1"  == "private" ]; then
  yarn graph version
  yarn create-local
  yarn deploy-local
  exit 0
fi

if [ -z "$TOKEN" ]; then
  echo "TOKEN is required";
  exit 1;
fi
if [ -z "$1" ]; then
  echo "A positional argument is required. Example: $0 rinkeby."
  exit 1;
fi

echo "Deploying requestnetwork/price-aggregators-$1"

yarn graph deploy --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ requestnetwork/price-aggregators-$1  --access-token $TOKEN ./subgraph.$1.yaml
