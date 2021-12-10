/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run, network ,upgrades} = require("hardhat");
const { utils, BigNumber } = require("ethers");
const R = require("ramda");
const { createQuestionGroup, answerQuestionGroups ,putBids} = require("./utils/lithiumPricing");

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

const getQuestionIdsByIndex = (startingQuestionId,lastIndex) =>{
  if(startingQuestionId > lastIndex){
    throw new Error("Invalid question id index")
  }
  var questionIds =[];
  for (let i=startingQuestionId;i<=lastIndex;i++){
      questionIds.push(i)
  }
  return questionIds;
}

const main = async () => {
  const accounts = await ethers.getSigners();
  const userAccounts = [...accounts.slice(1, 8)];
  account0 = accounts[0];
  account1 = accounts[1];
  account2 = accounts[2];
  account3 = accounts[3];
  const localCoordinatorAddress = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
  console.log(`Deploying to network ${network.name}`);

  console.log("\n\n 📡 Deploying Pricing...\n");

  const lithiumPricing = await deploy("LithiumPricing",[],{},{},true);
  const ProxyAdmin = await upgrades.admin.getInstance();
  chalk.cyan(console.log("ProxyAdmin Contract Address",chalk.magenta(ProxyAdmin.address)))
  const lithiumPricingImplementationAddress = await ProxyAdmin.getProxyImplementation(lithiumPricing.address)
  chalk.cyan(console.log("Lithium Pricing Implementation Address",chalk.magenta(lithiumPricingImplementationAddress)))

  console.log("\n\n 📡 Deploying Token...\n");

  const lithTokenArgs = [account0.address]
  console.log(`Token Address env var : ${process.env.TOKEN_ADDRESS}`)
  // if a TOKEN_ADDRESS is provided in the env vars do not deploy
  // else deploy a new token contract
  const lithToken = process.env.TOKEN_ADDRESS !== '' ?
    {address: process.env.TOKEN_ADDRESS} : await deploy("LithiumToken", lithTokenArgs); // <-- add in constructor args like line 19 vvvv

  if(process.env.TOKEN_ADDRESS !=''){
    fs.writeFileSync('artifacts/LithiumToken.address', lithToken.address);
  }
  await lithiumPricing.setLithiumTokenAddress(lithToken.address);


  const lithiumRewardArgs = [lithiumPricing.address]
  const lithiumReward = await deploy("LithiumReward", lithiumRewardArgs);

  await lithiumPricing.setLithiumRewardAddress(lithiumReward.address);


  if (network.name === "localhost") {
    await lithiumPricing.grantAdminRole(localCoordinatorAddress)
    await lithiumPricing.addCategory("Pre Coin Offering");
    await lithiumPricing.addCategory("Art Collection");
  
    if (lithToken.approve) {
      const transferBalance = ethers.utils.parseUnits("10000.0", 18);
      const approveAmount = BigNumber.from(2).pow(255).toString()
      console.log(`Approve amount is ${approveAmount}`)
      await lithToken.approve(lithiumPricing.address, approveAmount);

      await Promise.all(
        userAccounts.map((account) => prepareAccount(lithToken, lithiumPricing, account, approveAmount, transferBalance))
      )
    

      //Creating mock QuestionsGroup valid answers ends 1 minute
      const questionGroups = await createQuestionGroup(lithiumPricing, 60, 3);
      console.log(chalk.magenta("<>QuestionGroups created ", "\n"));
      
      //above  question group id 0 (i.e start from 0 to 7  questionIds:[0,1,2,3,4,5,6,7]))
      const questionIds1 = getQuestionIdsByIndex(0,7)
      await putBids(lithiumPricing,userAccounts,questionIds1);

      wait(4000)
      await answerQuestionGroups(lithiumPricing, questionGroups, userAccounts)
      console.log(chalk.magenta("<>QuestionGroups answered ", "\n"));

      //Creating mock QuestionsGroup invalid answers ends 1 minute
      const questionGroups1 = await createQuestionGroup(lithiumPricing, 60, 3);
      console.log(chalk.magenta("<><>QuestionGroups created 3 minimum answers", "\n"));
      wait(4000)
      await answerQuestionGroups(lithiumPricing, questionGroups1, userAccounts.slice(2,4), 2)
      console.log(chalk.magenta("<><>QuestionGroups 2 answer invalid 2", "\n"));

      //Creating mock QuestionsGroup no answers ends 1 minute
      await createQuestionGroup(lithiumPricing, 60, 1);
      console.log(chalk.magenta("<><><>QuestionGroups created no answers invalid", "\n"));

      //above  question group id 4 and 5 (i.e start from 16 to 23  questionIds:[16,17,18,19,20,21,22,23))
      const questionIds2 = getQuestionIdsByIndex(16,23)

      await putBids(lithiumPricing,userAccounts,questionIds2)

      //Creating mock QuestionsGroup no answers ends 100 minute
      await createQuestionGroup(lithiumPricing, 6000, 1);
      console.log(chalk.magenta("<><><><>QuestionGroups created no answers ongoing", "\n"));

      //above is question group id 6 and 7  (i.e start from 24 to 31 )
      const questionIds3 = getQuestionIdsByIndex(24,31)

      await putBids(lithiumPricing,userAccounts,questionIds3) 
      
      //Creating mock QuestionsGroup no answers starts in 100 minute
      await createQuestionGroup(lithiumPricing, 11000, 1, 10000);
      console.log(chalk.magenta("<><><><>QuestionGroups created no answers bidding ongoing", "\n"));

    } 
  }

  if (network.name !== "localhost") {
    // wait for the contracts to deploy so they can be verfied
    await wait(100000)
    console.log(chalk.blue('verifying on LithiumPricing etherscan'))
    await run("verify:verify", {
      address: lithiumPricingImplementationAddress,
      contract: "contracts/LithiumPricing.sol:LithiumPricing" // If you are inheriting from multiple contracts in yourContract.sol, you can specify which to verify
    })

    if (!process.env.TOKEN_ADDRESS) {
      console.log(chalk.blue('verifying on LithiumToken etherscan'))
      await run("verify:verify", {
        address: lithToken.address,
        contract: "contracts/LithiumToken.sol:LithiumToken", // If you are inheriting from multiple contracts in yourContract.sol, you can specify which to verify
        constructorArguments: lithTokenArgs // If your contract has constructor arguments, you can pass them as an array
      })
    } else {
      console.log(chalk.blue(`skipping verification of LithiumToken etherscan\nusing existing deployment at ${process.env.TOKEN_ADDRESS}`))
    }

    console.log(chalk.blue('verifying on LithiumReward etherscan'))
    await run("verify:verify", {
      address: lithiumReward.address,
      contract: "contracts/LithiumReward.sol:LithiumReward", // If you are inheriting from multiple contracts in yourContract.sol, you can specify which to verify
      constructorArguments: lithiumRewardArgs // If your contract has constructor arguments, you can pass them as an array
    })

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
  libraries = {},
  isProxy=false
) => {
  console.log(` 🛰  Deploying: ${contractName } ${isProxy?"Proxy":""}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const deployed = !isProxy ?await contractArtifacts.deploy(...contractArgs, overrides):await upgrades.deployProxy(contractArtifacts,contractArgs);
  await deployed.deployTransaction.wait();
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
    chalk.cyan(contractName,isProxy?"Proxy":""),
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
