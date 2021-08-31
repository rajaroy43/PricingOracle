import React, { useContext } from 'react'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import SelectWallet from '../forms/SelectWallet'
import UserProfile from '../users/UserProfile'

const ConnectedWallet = () => {
  // @ts-ignore
  const { address, setWallet } = useContext(WalletContext);
  // @ts-ignore
  const { loading, user } = useGetUser(subgraphClient, address);
  // @ts-ignore  
  let status
  if (loading) {
    status = <LoadingCircle />
  } else {
    status = address && user ? <UserProfile user={user} /> : <SelectWallet setWallet={setWallet} />
  }  

  return status;
}

export default ConnectedWallet