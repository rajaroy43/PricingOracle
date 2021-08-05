const fs = require("fs");
const chalk = require("chalk");
const bre = require("hardhat");
const publishDir = "../react-app/src/contracts";
const graphDir = "../subgraph"
const offChainDir="../off-chain"
function publishContract(contractName) {
  console.log(
    " 💽 Publishing",
    chalk.cyan(contractName),
    "to",
    chalk.gray(publishDir)
  );
  try {
    let contract = fs
      .readFileSync(`${bre.config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`)
      .toString();
    const address = fs
      .readFileSync(`${bre.config.paths.artifacts}/${contractName}.address`)
      .toString();
    contract = JSON.parse(contract);
    let graphConfigPath = `${graphDir}/config/config.json`
    let offChainConfigPath = `${offChainDir}/config/config.json`
    let graphConfig
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfig = fs
          .readFileSync(graphConfigPath)
          .toString();
      } else {
        graphConfig = '{}'
      }
      } catch (e) {
        console.log(e)
      }

    graphConfig = JSON.parse(graphConfig)
    graphConfig[contractName + "Address"] = address
    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );
    const graphPath = graphConfigPath.replace("/config.json","")
    if (!fs.existsSync(graphPath)){
      fs.mkdirSync(graphPath);
    }
    fs.writeFileSync(
      graphConfigPath,
      JSON.stringify(graphConfig, null, 2)
    );
    //putting same contract address to off-chain config

    const offChainPath = offChainConfigPath.replace("/config.json","")
    if (!fs.existsSync(offChainPath)){
      fs.mkdirSync(offChainPath);
    }
    fs.writeFileSync(
      offChainConfigPath,
      JSON.stringify(graphConfig, null, 2)
    );
    const graphFolderPath =  `${graphDir}/abis/`
    if (!fs.existsSync(graphFolderPath)){
      fs.mkdirSync(graphFolderPath);
    }
    fs.writeFileSync(
      `${graphDir}/abis/${contractName}.json`,
      JSON.stringify(contract.abi, null, 2)
    );
    const offChainFolderPath =  `${offChainDir}/abis/`
    if (!fs.existsSync(offChainFolderPath)){
      fs.mkdirSync(offChainFolderPath);
    }
    fs.writeFileSync(
      `${offChainDir}/abis/${contractName}.json`,
      JSON.stringify(contract.abi, null, 2)
    );
    console.log(" 📠 Published "+chalk.green(contractName)+" to the frontend.")

    return true;
  } catch (e) {
    if(e.toString().indexOf("no such file or directory")>=0){
      console.log(chalk.yellow(" ⚠️  Can't publish "+contractName+" yet (make sure it getting deployed)."))
    }else{
      console.log(e);
      return false;
    }
  }
}

async function main() {
  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }
  const finalContractList = [];
  fs.readdirSync(bre.config.paths.sources).forEach((file) => {
    if (file.indexOf(".sol") >= 0) {
      const contractName = file.replace(".sol", "");
      // Add contract to list if publishing is successful
      if (publishContract(contractName)) {
        finalContractList.push(contractName);
      }
    }
  });
  fs.writeFileSync(
    `${publishDir}/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
