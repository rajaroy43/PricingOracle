const { ethers ,upgrades} = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const chaiAsPromised = require("chai-as-promised");
use(solidity);
use(chaiAsPromised);
import { Wallet } from "@ethersproject/wallet";
import { LithiumPricing } from "../typechain";

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

    it("Should not upgrade if any variable  `maxAnswerSetLength` and `maxAnswerSetLength` is assigned an initial value", async () => {
    const pricingContractV2 = await ethers.getContractFactory("LithiumPricingInitializingVariable");
    await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected 
    });

    it("Should not upgrade if having constructor in implementation contract", async () => {
       const pricingContractV2 = await ethers.getContractFactory("LithiumPricingUsingConstructor");
       await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
     });

    it("Should not upgrade if having incompatible storage", async () => {
       const pricingContractV2 = await ethers.getContractFactory("LithiumPricingIncompatibleStorage");
       await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
    });

    it("Should not upgrade if  implementation logic is totally different", async () => {
         const pricingContractV2 = await ethers.getContractFactory("Roles");
         await expect(upgrades.upgradeProxy(lithiumPricingProxy.address , pricingContractV2)).to.be.rejected
    });
})