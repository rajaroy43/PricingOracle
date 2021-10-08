import React from 'react'
import { Grid } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { UserView } from '../../types/user'
// import AnswerList from '../answers/AnswerList'
import Flex from '../atoms/Flex'
import QuestionList from '../questions/QuestionList'
import UserEarnings from '../users/UserEarnings'
import UserStats from '../users/UserStats'
import UserInputRow from './UserInputRow'

const UserDashboard = ({user, connectedWallet}: {user: UserView, connectedWallet?: any}) => {
  if (user && connectedWallet) {

    return (
      <div>
        <Typography variant="h1">User Dashboard</Typography>
        { connectedWallet && <UserInputRow connectedWallet={connectedWallet} pricingIsApproved={user.pricingIsApproved} /> }
        <Grid container>
          <Grid item md={7} sm={7} xs={12}>
            <UserStats />
          </Grid>
          <Grid item md={5} sm={5} xs={12}>
            <UserEarnings user={user} />
          </Grid>
        </Grid>
        {
        
        <Flex justifyContent='start'>
          <QuestionList questions={user.questionViews} />
        </Flex>
        }
      </div>
    )
  } else {
    return (
      <>
        <Typography variant="h1">Available Questions</Typography>
        <p>Connect wallet to continue</p>
      </>
    )
  }
}

export default UserDashboard