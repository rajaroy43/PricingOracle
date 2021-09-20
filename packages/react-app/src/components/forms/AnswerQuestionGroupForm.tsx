import React from 'react'
import { Form } from 'formik'
import { answerQuestionGroupSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Typography from "@material-ui/core/Typography"
import Button from '../atoms/inputs/buttons/Button'
import { parseUnits } from '../../helpers/formatters'
import { makeStyles } from '@material-ui/core'
import AnswerQuestionInput from './AnswerQuestionInput'
import { QuestionView } from '../../types/question'
import { QuestionGroupView } from '../../types/questionGroup'

const useStyles = makeStyles(theme => ({
  answerItem: {
    backgroundColor: '#111111',
    borderRadius: '4px',
    '& p': {
      fontFamily: 'Rajdhani',
      fontSize: '18px',
      fontWeight: '500',
      marginTop: 0
    },
    marginBottom: '8px',
    padding: '24px',
    [theme.breakpoints.down('xs')]: {
      padding: '16px'
    },
  },
  answerItemInput: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'start',
      flexDirection: 'column',
      justifyContent: 'start'
    },
  },
  pricingTime: {
    fontWeight: 700
  },
  stakeAmountWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '48px',
    marginRight: '4px',
    noWrap: 'true',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'end',
      marginTop: '16px',
    }
  },
  stakeAmount: {
    color: '#ffffff !important',
    textAlign: 'right',
  },
  error: {
    color: '#ff0000',
    position: 'relative',
    top: '32px',
    left: '-64px'
  }
}));

const Success = () => (
  <div>
    <Typography variant="h3">Question Answered!</Typography>
  </div>
)

const getForm = (questions: QuestionView[], updateStake: any, classes: any) => (submit: any, isValid: boolean) => {
 
  return (
    <div className={classes.answerItem}>
      <Form>
        {questions.map((question, idx) => <AnswerQuestionInput key={idx} idx={idx} question={question} updateStake={updateStake(idx)} />)}
        <Button
          label="Submit Answer"
          onClick={submit}
          disabled={!isValid}
        />
      </Form>
    </div>
  )
} 

const getMethodArgs = (questionGroupId: string) => (values: any) => {
  const stakes = values.answers.map((v: any) => parseUnits(v.stakeAmount))
  const answerIndexes = values.answers.map((v: any) => parseInt(v.answerIndex, 10))

  return [questionGroupId, stakes, answerIndexes]
}

const AnswerQuestionGroupForm = ({ questionGroup, connectedWallet, updateStake }: {questionGroup: QuestionGroupView, connectedWallet: any, updateStake: any}) => {
  const classes = useStyles();
  const defaultQuestionValues = questionGroup.questions.map(() => {return {...answerQuestionGroupSchema.defaultValue}})


  const formProps = {
    defaultValues: {answers: defaultQuestionValues },
    schema: answerQuestionGroupSchema.schema,
    getForm: getForm(questionGroup.questionViews, updateStake, classes),
    // @ts-ignore    
    contractMethod: connectedWallet.pricingInstance.methods.answerQuestions,
    // @ts-ignore
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(questionGroup.id),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default AnswerQuestionGroupForm