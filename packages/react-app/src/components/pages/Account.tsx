import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import UserProfile from '../users/UserProfile'
import Base from './Base'
import SideBar from './SideBar'

const Account = ({match}: any) => {
  const urlAddress = match.params.address
  const connectedWallet = useContext(WalletContext)
  const {loading, user} = useGetUser(subgraphClient, urlAddress)
  //@ts-ignore
  const userWallet = connectedWallet!.address != null && urlAddress === connectedWallet.address ?
    connectedWallet : null

  const sideBarProps = {
      activePage: 'account',
      //@ts-ignore
      isWalletConnected: !!connectedWallet.wallet,
      //@ts-ignore
      walletAddress: connectedWallet.address
    }

  const main = (
    <div>
      <h1>Lithium Profile for {urlAddress}</h1>
      {loading ?
          <LoadingCircle />
          :
          user ?
            <UserProfile user={user} connectedWallet={userWallet} />
            :
            <div>No user</div>
      }
    </div>
  )
  return <Base main={main} sideBar={<SideBar {...sideBarProps} />} />
}

export default Account