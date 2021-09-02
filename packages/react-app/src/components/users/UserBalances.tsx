import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import Flex from '../atoms/Flex'
import { UserView } from '../../types/user'
import UserBalanceRow from './UserBalanceRow'

const useStyles = makeStyles(theme => ({
  userBalances: {
    marginTop: '8px',
    marginRight: '4px',
    marginLeft: '4px',
  },
}));

const UserBalances = ({user}: {user: UserView}) => {
  const classes = useStyles();

  return (
    <Flex justifyContent='space-around' flexDirection="column" className={classes.userBalances}>
      <UserBalanceRow title='Wallet' value={user.tokenBalanceDisplay} />
      <UserBalanceRow title='Staked' value={user.totalStakedDisplay} />
      <UserBalanceRow title='Earnings' value={user.totalRewardsClaimedDisplay} />    
    </Flex>
  );
}

export default UserBalances