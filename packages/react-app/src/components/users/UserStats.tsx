import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import UserReputationScoreItem from './UserReputationScoreItem'

const useStyles = makeStyles(theme => ({
  userStats: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: '16px',
    maxWidth: '320px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px',
    }
  },
  userReputation: {
    marginBottom: '40px',
    marginTop: '16px',
    marginLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0',
      marginBottom: '16px',
      marginLeft: '0',
      padding: '8px 0'
    },
  },
  noScore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start'
  },
  infoIcon: {
    marginLeft: '-8px',
    marginRight: '8px'
  }
}));

// mock data
const reputationScores = [
  { category: 'Crypto', score: 92, numAnswers: 6 },
  { category: 'Real Estate', score: 71, numAnswers: 2 },
  { category: 'Pre-IPO', score: 82, numAnswers: 4 }
];

// @ts-ignore
// const reputationScores = [];

const UserStats = () => {
  const classes = useStyles();

  return (
    <div className={classes.userStats}>
      <Typography variant="h3">My Stats:</Typography>
      <div className={classes.userReputation}>
        {reputationScores.length ?
          // @ts-ignore
          reputationScores.map((scoreItem => <UserReputationScoreItem scoreItem={scoreItem} key={scoreItem.category} />))
          :
          <div className={classes.noScore}>
            <img className={classes.infoIcon} src={require(`../../assets/icon-info.svg`)} alt='Info' />
            <p>My Stats measures the accuracy<br />
             of your scores in each category.<br />
             Answer 10 questions to reach Level 1.</p>
          </div>
        }
      </div>
    </div>
  )
}

export default UserStats