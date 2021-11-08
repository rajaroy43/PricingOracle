import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// TODO: Create type for UserProfile to replace UserView
//  { UserView } from '../../types/user'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import Badge from './Badge'
import Flex from '../atoms/Flex'
import LoadingCircle from '../atoms/Loading'
import Button from '../atoms/inputs/buttons/Button'
import UserBalances from './UserBalances'
import { WalletContext } from '../providers/WalletProvider';
import ClaimRewardForm from '../forms/ClaimReward';
import ConnectWalletFlow from '../forms/connectWallet/ConnectWalletFlow';

const useStyles = makeStyles(theme => ({
  userProfile: {
    backgroundColor: '#222222',
    border: 0,
    color: '#ffffff',
    padding: '12px'
  },
  buttonClaim: {
    
  }
}));

const UserProfile = ({ walletAddress }: {walletAddress: string}) => {
  const { wallet: {pricingInstance}, updaters: {disconnectWallet} } = useContext(WalletContext);
  const { loading, user } = useGetUser(subgraphClient, walletAddress);
  const classes = useStyles();

  if (loading) {
    return <LoadingCircle />
  } 
  if (walletAddress && user && pricingInstance) {
    return (
      <div className={classes.userProfile}>
        <Button label='Disconnect' onClick={disconnectWallet} />
        <Badge address={user.id} />
        <UserBalances user={user}/>
        <Flex justifyContent="flex-end" mt="1rem">
          <ClaimRewardForm
            connectedAddress={walletAddress}
            pricingInstance={pricingInstance}
            answerGroupIds={user.answerGroupsView.claimableIds}
            isDisabled={!user.answerGroupsView.hasUnclaimedRewards}
          />
        </Flex>
      </div>
    )
  }

  return <ConnectWalletFlow />
}

export default UserProfile