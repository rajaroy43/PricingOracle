const EthUtil = require('ethereumjs-util')
import  Common,{ Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

import { ethProvider } from '../client'
const getPublicKey = async (txHash:string)=>{
    
    const txData = await ethProvider.getTransaction(txHash);
    
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
        type:`0x${txData.type?.toString(16)}`
      }

      const chainId = (await ethProvider.getNetwork()).chainId

      const customCommon = Common.custom(
        {
          chainId: chainId,
        },
        { 
          hardfork:Hardfork.London
        },
      ); 
    //@ts-ignore
    const tx = FeeMarketEIP1559Transaction.fromTxData(modifiedTxData, { common: customCommon  })
      
    const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey());
    console.log("Public Key ",publicKey)
    console.log("user address",EthUtil.bufferToHex(tx.getSenderAddress()))
    return publicKey;
}

export default getPublicKey