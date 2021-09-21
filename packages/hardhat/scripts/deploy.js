/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, network } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { createQuestionGroup, answerQuestionGroups } = require("./utils/lithiumPricing");

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const prepareAccount = async (lithToken, lithiumPricing, account, approveAmount, transferAmount) => {
  await lithToken
    .connect(account)
    .approve(lithiumPricing.address, approveAmount);

  await lithToken
    .transfer(account.address, transferAmount);

}

const main = async () => {
  const accounts = await ethers.getSigners();
  const userAccounts = [...accounts.slice(1, 7)];
  account0 = accounts[0];
  account1 = accounts[1];
  account2 = accounts[2];
  account3 = accounts[3];
  console.log(`Deploying to network ${network.name}`);
  console.log("\n\n 📡 Deploying Pricing...\n");
  const lithiumPricing = await deploy("LithiumPricing");
  console.log("\n\n 📡 Deploying Token...\n");

  const lithToken = await deploy("LithiumToken", [account0.address]); // <-- add in constructor args like line 19 vvvv

  const lithiumReward = await deploy("LithiumReward", [lithiumPricing.address]);

  await lithiumPricing.setLithiumTokenAddress(lithToken.address);

  await lithiumPricing.setLithiumRewardAddress(lithiumReward.address);


  if (network.name === "localhost") {
    await lithiumPricing.addCategory("Pre Coin Offering");
    await lithiumPricing.addCategory("Art Collection");
  
    const transferBalance = ethers.utils.parseUnits("100000.0", 18);
    const approveAmount = ethers.utils.parseUnits("10000000000000.0", 18);
    await lithToken.approve(lithiumPricing.address, approveAmount);
    await Promise.all(
      userAccounts.map((account) => prepareAccount(lithToken, lithiumPricing, account, approveAmount, transferBalance))
    )

    //Creating mock QuestionsGroup
    const questionGroups = await createQuestionGroup(lithiumPricing);
    console.log(chalk.magenta("<>QuestionGroups created ", "\n"));
    wait(4000)
    await answerQuestionGroups(lithiumPricing, questionGroups, userAccounts)
    console.log(chalk.magenta("<>QuestionGroups answered ", "\n"));

    const questionGroups1 = await createQuestionGroup(lithiumPricing, 3);
    console.log(chalk.magenta("<><>QuestionGroups created 3 minimum answers", "\n"));
    wait(4000)
    await answerQuestionGroups(lithiumPricing, questionGroups1, userAccounts.slice(2,4), 2)
    console.log(chalk.magenta("<><>QuestionGroups 2 answer invalid 2", "\n"));

    await createQuestionGroup(lithiumPricing, 1);
    console.log(chalk.magenta("<><><>QuestionGroups created no answers invalid", "\n"));


  }

  //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
  /*
  await tenderlyVerify(
    {contractName: "YourContract",
     contractAddress: yourContract.address
  })
  */

  // If you want to verify your contract on etherscan
  /*
  console.log(chalk.blue('verifying on etherscan'))
  await run("verify:verify", {
    address: yourContract.address,
    // contract: "contracts/Example.sol:ExampleContract" // If you are inheriting from multiple contracts in yourContract.sol, you can specify which to verify
    // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
  })
  */

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (
  contractName,
  _args = [],
  overrides = {},
  libraries = {}
) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = "";
  if (deployed && deployed.deployTransaction) {
    const gasUsed = deployed.deployTransaction.gasLimit.mul(
      deployed.deployTransaction.gasPrice
    );
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${
      deployed.deployTransaction.hash
    }`;
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );
  console.log(" ⛽", chalk.grey(extraGasInfo));

  await tenderly.persistArtifacts({
    name: contractName,
    address: deployed.address,
  });

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};

// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 &&
  fileName.indexOf(".swp") < 0 &&
  fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({ contractName, contractAddress }) => {
  let tenderlyNetworks = [
    "kovan",
    "goerli",
    "mainnet",
    "rinkeby",
    "ropsten",
    "matic",
    "mumbai",
    "xDai",
    "POA",
  ];
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork;

  if (tenderlyNetworks.includes(targetNetwork)) {
    console.log(
      chalk.blue(
        ` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`
      )
    );

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress,
    });

    let verification = await tenderly.verify({
      name: contractName,
      address: contractAddress,
      network: targetNetwork,
    });

    return verification;
  } else {
    console.log(
      chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`)
    );
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
