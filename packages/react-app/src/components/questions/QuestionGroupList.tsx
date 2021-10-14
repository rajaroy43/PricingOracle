import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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