import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import UserDashboard from '../users/UserDashboard'

const Account = ({ match }: any) => {
  const urlAddress = match.params.address;
  const connectedWallet = useContext(WalletContext);
  const {loading, user} = useGetUser(subgraphClient, urlAddress);
  //@ts-ignore
  const userWallet = connectedWallet?.address != null && urlAddress === connectedWallet?.address ?
    connectedWallet : null

  const sideBarProps = {
    activePage: 'account',
    //@ts-ignore
    isWalletConnected: !!connectedWallet.wallet,
    //@ts-ignore
    walletAddress: connectedWallet.address
  }

  return (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      {loading ?
          <LoadingCircle />
          :
          user ?
            <UserDashboard user={user} connectedWallet={userWallet} />
            :
            <div>No user</div>
      }
    </WisdomNodeTemplate>
  )
}

export default Account