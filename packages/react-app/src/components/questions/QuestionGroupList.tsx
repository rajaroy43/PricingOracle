import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import { QuestionGroupView } from '../../types/questionGroup'
import QuestionGroupItem from './QuestionGroupItem'

const useStyles = makeStyles(theme => ({
  questionGroupItems: {
    margin: 0,
    padding: '16px 0 16px 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0'
    },
  }
}));

const QuestionGroupList = ({questionGroups}: {questionGroups: QuestionGroupView[]}) => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h3">Latest Question Groups:</Typography>
      <div className={classes.questionGroupItems}>
        {questionGroups.length ?
          questionGroups.map((questionGroup => <QuestionGroupItem questionGroup={questionGroup} key={questionGroup.id} />))
          :
          <div>No Question Groups</div>
        }
      </div>
    </div>
  )
}

export default QuestionGroupList