import mustache from "mustache";
import fs from "fs";
import path from "path";
import {chainlinkConversionPath, DeploymentInformation} from "@requestnetwork/smart-contracts";

type DataSource = {
  version: string;
  network: string;
  address: string;
  creationBlockNumber: number;
};

const deployments: Record<
  string,
  { deployment: Record<string, DeploymentInformation>; abi: any[] }
> = (chainlinkConversionPath as any).info;

const getTheGraphChainName = (chainName: string) => {
  switch (chainName) {
    case "xdai":
      return "gnosis";
    case "zksyncera":
      return "zksync-era";
    default:
      return chainName;
  }
};

const prepare = () => {
  const templates: Record<string, DataSource[]> = {};

  for (const [v, { deployment, abi }] of Object.entries(deployments)) {
    const version = v.split(".").join("_");
    fs.writeFileSync(
        path.join(__dirname, `../abis/AggregatorContract-${version}.json`),
        JSON.stringify(abi, null, 2)
    );
    for (const [network, { address, creationBlockNumber }] of Object.entries(
        deployment
    )) {
      if(['rinkeby', 'arbitrum-rinkeby', 'goerli'].includes(network)) continue;
      if (!templates[network]) templates[network] = [];
      templates[network].push({
        address,
        creationBlockNumber,
        network: getTheGraphChainName(network),
        version
      });
    }
  }

  const template = fs
      .readFileSync(path.join(__dirname, "../subgraph.template.yaml"))
      .toString();

  for (const [network, dataSources] of Object.entries(templates)) {
    const result = mustache.render(template, { dataSources });
    fs.writeFileSync(`subgraph.${network}.yaml`, result);
  }
}

prepare();
