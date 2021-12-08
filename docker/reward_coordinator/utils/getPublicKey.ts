const EthUtil = require('ethereumjs-util')
import  Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Transaction } from '@ethersproject/transactions'
//@ts-ignore
import { config } from '../config'
import { getTransactionData } from '../queries/ethNode'

const getModifiedTxData = (txData:Transaction )=>{
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
  return modifiedTxData
}

const getPublicKeyFromTx = async (txHash:string)=>{
    
    const txData = await getTransactionData(txHash);
  
    const modifiedTxData = getModifiedTxData(txData)

    const customCommon = Common.custom(
      {
        chainId: config.CHAIN_ID,
      },
      { 
        hardfork:config.Hardfork
      },
    );

    //@ts-ignore
    const tx = FeeMarketEIP1559Transaction.fromTxData(modifiedTxData, { common: customCommon  })
      
    const publicKey = EthUtil.bufferToHex(tx.getSenderPublicKey());
    return publicKey;
}

export default getPublicKeyFromTx