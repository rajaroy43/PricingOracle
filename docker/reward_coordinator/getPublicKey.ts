import { ethers } from "ethers";
const EthUtil = require('ethereumjs-util')
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
const ethProvider = ethers.providers.getDefaultProvider(process.env.ETH_NODE)
console.log(process.env.ETH_NODE)
const getPublicKey = async (address:string)=>{
    
    const getTxcount = await ethProvider.getTransactionCount(address);
    if(getTxcount == 0){
        throw new Error(`This user ${address} don't have any transaction`)
    }
    
    
    //calculate tx hash here from user address
    
    const txHash="0x877967d215feeb5489612e766ff7c0dc86d289cd659fb4f32dca051b13669e03"
    const txData=await ethProvider.getTransaction(txHash);

    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    const modifiedTxData = {
        nonce: `0x${txData.nonce.toString(16)}`,
        gasPrice: txData.gasPrice?.toHexString(),
        gasLimit: txData.gasLimit.toHexString(),
        to: txData.to,
        value: txData.value.toHexString(),
        data: txData.data,
        v: `0x${txData.v?.toString(16)}`,
        r: txData.r,
        s: txData.s,
        maxPriorityFeePerGas: txData.maxPriorityFeePerGas?.toHexString(),
        maxFeePerGas: txData.maxFeePerGas?.toHexString(),      
        type:`0x${txData.type?.toString(16)}`,
      }
    //@ts-ignore
    const tx = FeeMarketEIP1559Transaction.fromTxData(modifiedTxData, { common })
    const getUserAddress = EthUtil.bufferToHex(tx.getSenderAddress());
    if(parseInt(address) != parseInt(getUserAddress)){
        throw new Error(`Not verified user with address ${address}`)
    }
    const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey());
    console.log("Public Key ",publicKey)
    return publicKey;
}

getPublicKey("0xa32bB4346E216187b09D99345244275C96E648fE")

export default getPublicKey