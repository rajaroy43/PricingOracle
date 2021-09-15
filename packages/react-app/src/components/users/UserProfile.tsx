import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// TODO: Create type for UserProfile to replace UserView
//  { UserView } from '../../types/user'
import { subgraphClient } from '../../client'
import { useGetUser } from '../../queries/user'
import Badge from './Badge'
import Button from '../atoms/inputs/buttons/Button'
import Flex from '../atoms/Flex'
import LoadingCircle from '../atoms/Loading'
import UserBalances from './UserBalances'
import { WalletContext } from '../providers/WalletProvider';
import SelectWalletForm from '../forms/SelectWallet';

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

const UserProfile = ({ walletAddress }: {walletAddress: any}) => {
  // @ts-ignore
  const { setWallet } = useContext(WalletContext);
  // @ts-ignore
  const { loading, user } = useGetUser(subgraphClient, walletAddress);
  const classes = useStyles();

  if (loading) {
    return <LoadingCircle />
  } 

  if (walletAddress && user) {
    return (
      <div className={classes.userProfile}>
        <Badge address={user.id} />
        <UserBalances user={user}/>
        <Flex justifyContent="flex-end" mt="1rem">
          <Button onClick={() => {}}label="Claim all" />
        </Flex>
      </div>
    )
  }

  return <SelectWalletForm setWallet={setWallet} />
}

export default UserProfile