const hre = require("hardhat")
const fs = require("fs");
const ethers=hre.ethers
const {
  answerQuestionGroups,
} = require("./utils/lithiumPricing");
const prepareAccount = async (
  lithToken,
  lithiumPricing,
  account,
  approveAmount,
  transferAmount
) => {
  const userBalance=await lithToken.balanceOf(account.address);
  const userApprovalBalance=await lithToken.allowance(account.address,lithiumPricing.address);
  if(userApprovalBalance < approveAmount)
  await lithToken
    .connect(account)
    .approve(lithiumPricing.address, approveAmount);

  if(userBalance < approveAmount)

  await lithToken.transfer(account.address, transferAmount);
  
};
const answers100 = async () => {
  if (hre.network.name === "localhost") {
    const questionGroupId = parseInt(process.argv[2])
    if(! questionGroupId) throw Error("Provide Question GroupId as yarn answer-100 questiongroupId")
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
    let getquestionGroups;
    try {
      getquestionGroups = await lithiumPricing.getQuestionIds(questionGroupId);
    } catch (error) {
      console.log(`Given questionGroupId ${questionGroupId} is not a valid question group id` )
      return ;
    }
    const accounts = await ethers.getSigners();
    const userAccounts = [...accounts.slice(1, 101)];
    const transferBalance = ethers.utils.parseUnits("100000.0", 18);
    const approveAmount = ethers.utils.parseUnits("10000000000000.0", 18);
    console.log(`Preparing ${userAccounts.length} wisdom-node for questionGroupId ${questionGroupId}`);
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
  
    const questionGroups = [[getquestionGroups]]

    await answerQuestionGroups(lithiumPricing, questionGroups, userAccounts, questionGroupId);

    console.log(`question group answered `);
  }
};

answers100()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

