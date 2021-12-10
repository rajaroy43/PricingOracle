import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { QuestionView } from '../../types/question'
import Address from '../atoms/Address'

const useStyles = makeStyles(theme => ({
  address: {
    display: 'inline'
  },
  question: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 500,
    lineHeight: '18px',
    marginBottom: '16px'
  },
  questionLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  desc: {
    fontSize: '20px',
    marginBottom: '4px'
  }
}));

const QuestionItem = ({id, question}: {id: string, question: QuestionView}) => {
  const classes = useStyles();

  return (
    <div className={classes.question}>
      <RouterLink to={`/wisdom-node/question/${question.id}`} className={classes.questionLink}>
        <div className={classes.desc}>#{question.id} - {question.description} {question.answerSetDisplay[1]} on {question.pricingTimeDisplay}</div>
      </RouterLink>
      <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
      <div>Status: {question.isFinished ? 'Finished' : 'Active'}</div>
    </div>
  )
}

export default QuestionItem