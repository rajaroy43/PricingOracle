import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import Flex from '../atoms/Flex'
import Button from '../atoms/inputs/buttons/Button'

const useStyles = makeStyles(theme => ({
  userEarnings: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: '16px',
    marginBottom: '40px',
    marginLeft: '16px',
    maxWidth: '320px',
    [theme.breakpoints.down('sm')]: {
        marginTop: '8px',
        marginBottom: '24px',
    },
    [theme.breakpoints.down('xs')]: {
        marginTop: '8px',
        marginBottom: '24px',
        marginLeft: '0'
    }    
  },
  earningsTable: {
    marginTop: '16px',
    marginLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0',
      marginBottom: '8px',
      marginLeft: '0',
      padding: '8px 0'
    }
  },
  earningsItem: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 600,
    justifyContent: 'space-between',
    marginTop: '8px',
    textAlign: 'left',
    whitespace: 'noWrap',
  },
  itemValue: {
    paddingLeft: '8px'
  },
}));


const UserEarnings = () => {
  const classes = useStyles();

  // mock data
  // TODO: Change this to wei and format
  const earnings = {
    claimedEarnings: '1,000,000.00 LITH',
    unclaimedEarnings: '400 LITH'
  };

  return (
    <div className={classes.userEarnings}>
        <Typography variant="h3">My Earnings:</Typography>
        <div className={classes.earningsTable}>
            <div className={classes.earningsItem}> 
                Claimed earnings: <div className={classes.itemValue}>{earnings.claimedEarnings}</div>
            </div>
            <div className={classes.earningsItem}> 
                Unclaimed: <div className={classes.itemValue}>{earnings.unclaimedEarnings}</div>
            </div>
        </div>
        <Flex justifyContent="flex-end" mt="1rem">
            <Button onClick={() => {}}label="Claim all" />
        </Flex>
    </div>
  )
}

export default UserEarnings