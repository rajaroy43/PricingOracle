import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import UserDashboard from '../users/UserDashboard'

const Account = ({ match }: any) => {
  const urlAddress = match.params.address;
  const {wallet} = useContext(WalletContext);
  const {loading, user} = useGetUser(subgraphClient, urlAddress);
  const userWallet = urlAddress === wallet.address ?
    wallet : null
  const sideBarProps = {
    activePage: 'account',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
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