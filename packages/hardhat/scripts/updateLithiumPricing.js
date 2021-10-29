const { ethers, run, network ,upgrades} = require("hardhat");
const chalk = require("chalk");


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  
const main = async () => {

    console.log(chalk.magenta(`\n Upgrading Lithium Pricing on ${network.name}`, "\n"));

    //Modified/New LithiumPricing implementation Contract
    const lithiumPricingImplementation = await ethers.getContractFactory("LithiumPricing");
    
    const Lithium_Pricing_Proxy_Address = process.env.Lithium_Pricing_Proxy

    if (!Lithium_Pricing_Proxy_Address) {
      throw new Error("No LithiumPricingProxy Address found")
    }

    console.log(`Lithium Pricing Proxy  env var : ${Lithium_Pricing_Proxy_Address}`)

    const checkContractCode=await ethers.provider.getCode(Lithium_Pricing_Proxy_Address)
    
    if(checkContractCode == '0x')
    throw new Error(`Given Address ${Lithium_Pricing_Proxy_Address} is not a valid Proxy Contract `)
   

    const ProxyAdmin= await upgrades.admin.getInstance();
    const initialLithiumPricingImplementationAddress = await ProxyAdmin.getProxyImplementation(Lithium_Pricing_Proxy_Address )  
    console.log("Current LithiumPricing Implementation Address",initialLithiumPricingImplementationAddress)
    
    await upgrades.upgradeProxy(Lithium_Pricing_Proxy_Address , lithiumPricingImplementation);
    
    const updatedLithiumPricingImplementationAddress = await ProxyAdmin.getProxyImplementation(Lithium_Pricing_Proxy_Address )  
    
    console.log("Updated LithiumPricing Implementation Address",updatedLithiumPricingImplementationAddress);
    
    if (network.name !== "localhost") {
        // wait for the contracts to deploy so they can be verfied
        await wait(10000)
        console.log(chalk.blue('verifying  LithiumPricing Implementation on etherscan'))
        await run("verify:verify", {
          address: updatedLithiumPricingImplementationAddress,
          
          //put contracts:contracts/ModifiedLithiumPricing.sol:LithiumPricing if upgrading
          contract: "contracts/LithiumPricing.sol:LithiumPricing" // If you are inheriting from multiple contracts in yourContract.sol, you can specify which to verify
        })
    }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });