const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  createQuestionGroup,
  answerQuestionGroups,
} = require("./utils/lithiumPricing");
const prepareAccount = async (
  lithToken,
  lithiumPricing,
  account,
  approveAmount,
  transferAmount
) => {
  await lithToken
    .connect(account)
    .approve(lithiumPricing.address, approveAmount);

  await lithToken.transfer(account.address, transferAmount);
};
const answers100 = async () => {
  if (network.name === "localhost") {
    const LithiumPricingAddress = fs.readFileSync(
      `artifacts/LithiumPricing.address`
    );

    const LithiumTokenAddress = fs.readFileSync(
      `artifacts/LithiumToken.address`
    );

    const lithiumPricing = await ethers.getContractAt(
      "LithiumPricing",
      LithiumPricingAddress.toString()
    );

    const lithiumToken = await ethers.getContractAt(
      "LithiumToken",
      LithiumTokenAddress.toString()
    );
    const accounts = await ethers.getSigners();
    const userAccounts = [...accounts.slice(1, 101)];
    const transferBalance = ethers.utils.parseUnits("100000.0", 18);
    const approveAmount = ethers.utils.parseUnits("10000000000000.0", 18);
    console.log(`Preparing ${userAccounts.length} wisdom-node`);
    await Promise.all(
      userAccounts.map((account) =>
        prepareAccount(
          lithiumToken,
          lithiumPricing,
          account,
          approveAmount,
          transferBalance
        )
      )
    );
    console.log("Account Prepared");

    //Creating mock QuestionsGroup valid answers ends 1 minute

    const questionGroups = await createQuestionGroup(lithiumPricing);

    await answerQuestionGroups(lithiumPricing, questionGroups, userAccounts, 8);

    console.log(`question group answered `);
  }
};

answers100()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
