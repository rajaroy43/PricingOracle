import React from 'react'
import Box from '../atoms/Box'
import { UserView } from '../../types/user'
import Card from '../atoms/Card'


const UserBalances = ({user}: {user: UserView}) => (
  <Box style={{margin: 0, padding: 0}}>
    <div>
      <Card title={'Token Balance'} text={user.tokenBalanceDisplay} />
      <Card title={'Total Bounty'} text={user.totalBountyDisplay} />
      <Card title={'Rewards Claimed'} text={user.totalRewardsClaimedDisplay} />
      <Card title={'Total Staked'} text={user.totalStakedDisplay} />
    </div>
  </Box>
)


export default UserBalances