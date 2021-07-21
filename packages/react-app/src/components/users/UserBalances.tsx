import React from 'react'
import Flex from '../atoms/Flex'
import { UserView } from '../../types/user'
import Card from '../atoms/Card'


const UserBalances = ({user}: {user: UserView}) => (
  <Flex  justifyContent='space-around'>
    <Card title={'Token Balance'} text={user.tokenBalanceDisplay} />
    <Card title={'Total Bounty'} text={user.totalBountyDisplay} />
    <Card title={'Rewards Claimed'} text={user.totalRewardsClaimedDisplay} />
    <Card title={'Total Staked'} text={user.totalStakedDisplay} />
  </Flex>
)


export default UserBalances