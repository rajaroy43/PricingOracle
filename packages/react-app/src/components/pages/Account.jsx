import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import UserProfile from '../users/UserProfile'
import Base from './Base'

const Account = ({match}) => {
  const urlAddress = match.params.address
  const {loading, user} = useGetUser(subgraphClient, urlAddress)
  const connectedWallet = useContext(WalletContext)
  console.log(`aadress ${urlAddress} wallet address ${connectedWallet.address} ${connectedWallet.pricingInstance}`)
  const userWallet = urlAddress === connectedWallet.address ?
    connectedWallet : null
  return (
    <Base>
     <h1>Lithium Profile for {urlAddress}</h1>
     {loading ?
        <LoadingCircle />
        :
        user ?
          <UserProfile user={user} connectedWallet={userWallet} />
          :
          <div>No user</div>
     }
    </Base>
  )
}

export default Account