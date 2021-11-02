const { ethers ,upgrades} = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const chaiAsPromised = require("chai-as-promised");
use(solidity);
use(chaiAsPromised);
import { Wallet } from "@ethersproject/wallet";
import { LithiumPricing, LithiumPricingV2 } from "../typechain";

describe("Upgrading  Lithium Pricing", async function () {
  let lithiumPricingProxy: LithiumPricing,
    account0: Wallet,
    account1: Wallet;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    account0 = accounts[0];
    account1 = accounts[1];
    const pricingContract = await ethers.getContractFactory("LithiumPricing");
    lithiumPricingProxy = await upgrades.deployProxy(pricingContract);
  });


  it("Should  able to upgrade new version ", async () => {
    //setting new bool isLithiumTokenSet if we already set LithiumToken
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingV2");
    const previousAddress = lithiumPricingProxy.address;
    const lithiumTokenAddress = account1.address;

    const upgradedProxy = await upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)
    
    await expect(lithiumPricingProxy.setLithiumTokenAddress(lithiumTokenAddress))
    .emit(lithiumPricingProxy,"SetLithiumTokenAddress")
    .withArgs(lithiumTokenAddress)

    await expect(lithiumPricingProxy.setLithiumTokenAddress(lithiumTokenAddress))
    .to.be.revertedWith("Already Lithium Token Set")

    expect(upgradedProxy.address).to.equal(previousAddress);
  });


  it("Should  upgrade new version as old version", async () => {
    //adding new variable totalBid in between userReputationScores and minimumStake
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricing");
    const previousAddress = lithiumPricingProxy.address;
    const ProxyAdmin = await upgrades.admin.getInstance();
    const upgradedProxy = await upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)
    upgradedProxy.emit(ProxyAdmin,"upgraded")
    expect(upgradedProxy.address).to.equal(previousAddress);
  });

  it("Should  not allow non admin to upgrade", async () => {
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingV2");
    const ProxyAdmin = await upgrades.admin.getInstance();
    await ProxyAdmin.transferOwnership(account1.address)
    
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2))
    .to.be.revertedWith("Ownable: caller is not the owner")
  });

  it("Should not upgrade using `selfdestruct` in implemntation contract ", async () => {
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingWithSelfDestruct");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected 
  });

  it("Should not upgrade if any variable  `maxAnswerSetLength` and `maxAnswerSetLength` is assigned an initial value", async () => {
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingInitializingVariable");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected 
  });

  it("Should not upgrade if having constructor in implementation contract", async () => {
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingUsingConstructor");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
  });

  it("Should not upgrade if having incompatible storage", async () => {
    //adding new variable totalBid in between userReputationScores and minimumStake
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingIncompatibleStorage");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
  });

  it("Should not upgrade if  implementation logic is totally different", async () => {
    const pricingContractV2 = await ethers.getContractFactory("Roles");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
  });

  it("Should not upgrade if ordering of state variable `userReputationScores and minimumStake ` changed", async () => {
    //replace postion variable 
    
    //from:
    
    //mapping (address => mapping(uint256=>uint256)) userReputationScores;
    //uint256 public minimumStake;
  
    
    //to :
    
    //uint256 public minimumStake;
    //mapping (address => mapping(uint256=>uint256)) userReputationScores; 

    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingOrderChange");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
  });
})