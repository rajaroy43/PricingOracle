const fs = require("fs");
const chalk = require("chalk");
const bre = require("hardhat");

const multiDArray = "[][]"
const includesMultiDArray = (params) => {
  if (params == null)  {
    return false
  }

  return !!params.filter(param => param.type.includes(multiDArray)).length 
}

const checkForMultiDArrays =  (methodOrEvent) => {
  const hasMultiDArray =  includesMultiDArray(methodOrEvent.inputs) || includesMultiDArray(methodOrEvent.outputs)
  return !hasMultiDArray
}

function publishContract(contractName, publishTarget) {
  const targetDir = `${publishTarget.path}/contractDeployments/${process.env.DEPLOY_CHAIN_TARGET}`
  const abisDir = publishTarget.abiDir ? `${publishTarget.path}${publishTarget.abiDir}`: `${targetDir}/abis`
  console.log(
    " 💽 Publishing",
    chalk.cyan(contractName),
    "to",
    chalk.gray(targetDir),
    chalk.yellow(abisDir)
  );
  try {
    let contract = fs
      .readFileSync(`${bre.config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`)
      .toString();
    const address = fs
      .readFileSync(`${bre.config.paths.artifacts}/${contractName}.address`)
      .toString();
    contract = JSON.parse(contract);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, {recursive: true})
    }

    if (!fs.existsSync(abisDir)) {
      fs.mkdirSync(abisDir, {recursive: true})
    }

    const configPath = `${targetDir}/config.json`
    let targetConfig = fs.existsSync(configPath) ?
      fs.readFileSync(configPath).toString()
      :
      '{}'

    const parsedConfig = JSON.parse(targetConfig)
    parsedConfig[contractName + "Address"] = address

    const abi = publishTarget.abiFilter != null ? contract.abi.filter(publishTarget.abiFilter) : contract.abi

    // the subgraph requires a different format
    const abiExtension = publishTarget.path.includes('subgraph') ? '.json' : '.abi.js'
    const abiPrefix = publishTarget.path.includes('subgraph') ? '' : 'module.exports =' 
    fs.writeFileSync(
      `${abisDir}/${contractName}${abiExtension}`,
      `module.exports = ${JSON.stringify(abi, null, 2)};`
    );
    fs.writeFileSync(
      `${abisDir}/${contractName}.bytecode.js`,
      `${abiPrefix}"${contract.bytecode}";`
    );

    fs.writeFileSync(
      configPath,
      JSON.stringify(parsedConfig, null, 2)
    );

    return true;
  } catch (e) {
    if(e.toString().indexOf("no such file or directory")>=0){
      console.log(chalk.yellow(" ⚠️  Can't publish "+contractName+" yet (make sure it getting deployed)."+e.message))
    }else{
      console.log(e);
      return false;
    }
  }
}

const publishTargets = [
  {
    path: "../react-app/src"
  },
  {
    path: "../subgraph",
    abiDir: '/abis',
    abiFilter: checkForMultiDArrays
  },
  {
    path: "../../docker/reward_coordinator"
  }
]

async function main() {
  fs.readdirSync(bre.config.paths.sources).forEach((file) => {
    if (file.indexOf(".sol") >= 0) {
      const contractName = file.replace(".sol", "");
      publishTargets.map((target) => {
        publishContract(contractName, target)
      })
      
    }
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
