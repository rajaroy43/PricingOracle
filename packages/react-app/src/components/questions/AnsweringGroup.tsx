import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// TODO: Make AnswerGroupView
// import { QuestionGroupView } from '../../types/questionGroup'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
import { Link as RouterLink } from 'react-router-dom'
import AnswerQuestionGroupForm from '../forms/AnswerQuestionGroupForm'
import { QuestionGroupView } from '../../types/questionGroup'
import TimeLeft from '../atoms/TimeLeft'
import { secToMs } from '../../helpers/formatters'

const useStyles = makeStyles(theme => ({
  buttonBack: {
    backgroundColor: 'white',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 700,
    '&:hover': {
        backgroundColor: 'white'
    }
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '24px'
  },
  timeRowMobile: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '16px',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
  },
  titleRowButton: {
    alignSelf: 'end',
    marginRight: '8px',
    whitespace: 'nowrap',
    width: 'fit-content',
  },
  answerGroupItems: {
    margin: 0,
    padding: '16px 0 16px 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0'
    },
  },
  questionGroupTitle: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 500
  },
  questionGroupId: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '32px',
    fontWeight: 500
  },
  timeCol: {
    alignSelf: 'end',
    display: 'flex',
    justifyContent: 'end',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
        display: 'none',
    },
  },
  questionGroupTime: {
    alignSelf: 'flex-end',
    border: '2px solid #E95F36',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '20px',
    fontWeight: 700,
    marginRight: '2px',
    marginTop: '4px',
    justifySelf: 'end',
    textAlign: 'right',
    padding: '4px 8px',
    width: 'fit-content'
  },
}));

const AnsweringGroup = ({questionGroup, connectedWallet}: {questionGroup: QuestionGroupView, connectedWallet: any}) => {
  const classes = useStyles();

  const mockData = {
    timeLeft: "00:00:00"
  };
  const form = questionGroup.questionViews.length ?
    <AnswerQuestionGroupForm questionGroup={questionGroup} connectedWallet={connectedWallet} />
    :
    <div className={classes.answerGroupItems}>
      <div>No Questions</div>
    </div>
  const notStarted = <div>Question Group Not Yet AVailable for Answering</div>
  const finished = <div>Question Group Answering Period Completed</div>
  const content = !questionGroup.isStarted ? notStarted : questionGroup.isFinished ? finished : form
  const isAnsweredContent = <Typography variant="h3">Question Set Already Answered</Typography>
  const isAnswered = !!(questionGroup.questions[0].answers && questionGroup.questions[0].answers.length)
  return (
    <>
        <div className={classes.titleRow}>
            <div className={classes.titleRowButton}>
                <Button className={classes.buttonBack} component={RouterLink} to='/wisdom-node/available-questions'>Back</Button>
            </div>
            <div>
                <Typography variant="h2" className={classes.questionGroupTitle} noWrap={true}>Question Group</Typography>
                <Typography variant="h3" className={classes.questionGroupId}>#{questionGroup.id}</Typography>
            </div>
            <div className={classes.timeCol}>
              <TimeLeft label='Time Left' targetTime={secToMs(parseInt(questionGroup.endTime, 10))} />
               
            </div>    
        </div>  
        <div className={classes.timeRowMobile}>
            <TimeLeft label='Time Left' targetTime={secToMs(parseInt(questionGroup.endTime, 10))} />
        </div>

        {isAnswered ? isAnsweredContent : content}
    </>
  )
}

export default AnsweringGroup