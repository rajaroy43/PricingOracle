import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// TODO: Make AnswerGroupView
// import { QuestionGroupView } from '../../types/questionGroup'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
import { Link as RouterLink } from 'react-router-dom'
import AnswerQuestionGroupForm from '../forms/AnswerQuestionGroupForm'
import { QuestionGroupView } from '../../types/questionGroup'

const useStyles = makeStyles(theme => ({
  buttonBack: {
    backgroundColor: 'white',
    fontFamily: 'Rajdhani',
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
    fontFamily: 'Rajdhani',
    fontSize: '16px',
    fontWeight: 400
  },
  questionGroupId: {
    fontFamily: 'Rajdhani',
    fontSize: '32px',
    fontWeight: 400
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
    fontFamily: 'Rajdhani',
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

const AnswerGroupList = ({questionGroup}: {questionGroup: QuestionGroupView}) => {
  const classes = useStyles();
  return (
    <>
        <div className={classes.titleRow}>
            <div className={classes.titleRowButton}>
                <Button className={classes.buttonBack} component={RouterLink} to={'/wisdom-node/available-questions'}>Back</Button>
            </div>
            <div>
                <Typography variant="h2" className={classes.questionGroupTitle} noWrap={true}>Question Group</Typography>
                <Typography variant="h3" className={classes.questionGroupId}>#{questionGroup.id}</Typography>
            </div>
            <div className={classes.timeCol}>
                <div className={classes.questionGroupTime}>Time left: 00:00:00</div> 
            </div>    
        </div>  
        <div className={classes.timeRowMobile}>
            <div className={classes.questionGroupTime}>Time left: 00:00:00</div> 
        </div>

        <div className={classes.answerGroupItems}>
            {questionGroup.questionViews.length ?
            <AnswerQuestionGroupForm questionGroup={questionGroup} onSuccess={() => {console.log('success')}} />
            :
            <div>No Question Groups</div>
            }
        </div>
    </>
  )
}

export default AnswerGroupList