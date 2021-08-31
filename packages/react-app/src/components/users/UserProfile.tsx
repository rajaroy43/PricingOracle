import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { UserView } from '../../types/user'
import Badge from './Badge'
import Button from '../atoms/inputs/buttons/Button'
import Flex from '../atoms/Flex'
import UserBalances from './UserBalances'

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

const UserProfile = ({user}: {user: UserView}) => {
  const classes = useStyles();

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

export default UserProfile