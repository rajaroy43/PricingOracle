import { ethProvider } from "../client"

export const getTransactionCount = async(address:string)=>{
   const txCount = await ethProvider.getTransactionCount(address);
   return txCount
}

export const getTransactionData = async(txHash:string)=>{
    const txData = await ethProvider.getTransaction(txHash);
    return txData
}