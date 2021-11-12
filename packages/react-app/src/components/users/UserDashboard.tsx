import React from 'react'
import { Grid } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { UserView } from '../../types/user'
import UserEarnings from '../users/UserEarnings'
import UserStats from '../users/UserStats'

const UserDashboard = ({user, connectedWallet}: {user: UserView, connectedWallet: any}) => {
  if (user && connectedWallet) {
    return (
      <div>
        <Typography variant="h1">User Dashboard</Typography>
        <Grid container>
          <Grid item md={7} sm={7} xs={12}>
            <UserStats />
          </Grid>
          <Grid item md={5} sm={5} xs={12}>
            <UserEarnings user={user} />
          </Grid>
        </Grid>
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