# Price Aggregators

This subgraph indexes the price aggregators updates for easy query.

## Deploy a subgraph

1. If it does not exist yet, create the subgraph on TheGraph Studio. Follow the naming convention: `price-aggregators-[chain]`
2. Clone this repo
3. Update the `@requestnetwork/smart-contracts` version in `package.json`
4. Run `yarn` to install dependencies and generate the manifest files
5. Run `DEPLOY_KEY=[subgraph_studio_deploy_key] ./scripts/deploy.sh [chain]`

> **Important**: Once a subgraph is deployed on Subgraph Studio,
> a manual action is required to publish it to the decentralized network.
> See [the documentation](https://thegraph.com/docs/en/publishing/publishing-a-subgraph/) for more information.
