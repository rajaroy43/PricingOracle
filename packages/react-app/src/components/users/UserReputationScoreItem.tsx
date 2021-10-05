import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  reputationScoreItem: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 600,
    justifyContent: 'space-between',
    marginTop: '8px',
    textAlign: 'right',
    whitespace: 'noWrap',
    width: '220px'
  },
  score: {
    paddingLeft: '8px'
  },
  answers: {
    fontSize: '14px'
  }
}));

const UserReputationScoreItem = ({scoreItem} : {scoreItem: any}) => {
  const classes = useStyles();

  return (
    <div className={classes.reputationScoreItem}> 
        {scoreItem.category}: <div className={classes.score}>{scoreItem.score} &nbsp;<span className={classes.answers}>({scoreItem.numAnswers} answers)</span></div>
    </div>
  )
}

export default UserReputationScoreItem