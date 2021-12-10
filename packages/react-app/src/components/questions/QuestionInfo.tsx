import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { QuestionView } from '../../types/question'
import Address from '../atoms/Address'
import Flex from '../atoms/Flex'

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
    marginBottom: '4px',
    marginTop: '8px'
  }
}));

const QuestionItem = ({question}: {question: QuestionView}) => {
  const classes = useStyles();

  return (
    <div className={classes.question}>
      <div className={classes.desc}>{question.description} {question.answerSetDisplay[1]} on {question.pricingTimeDisplay}</div>
      <Flex>Asked by&nbsp;<Address address={question.owner.id} length={4} /></Flex>
      <div>Status: {question.isFinished ? 'Finished' : 'Active'}</div>
      <div>Bounty: {question.bountyDisplay}</div>
      <div>Total Staked: {question.totalStakedDisplay}</div>
      {question.isFinished &&
        <div>
          Final Answer: {question.topAnswerDisplay}
        </div>
      }
    </div>
  )
}

export default QuestionItem