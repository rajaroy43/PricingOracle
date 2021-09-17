import React, { useContext } from 'react'
import { Form } from 'formik'
import { WalletContext } from '../providers/WalletProvider'
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

const radioOptions = [
  {
    label: "Yes",
    value: "yes"
  },
  {
    label: "No",
    value: "no"
  }
]

const radioStyle = {
  flexDirection: 'row',
  justifyContent: 'start',
}

const inputLabelProps = {
  disableAnimation: true, 
  shrink: false,
  style: {marginRight: '8px'}
}

const getForm = (questions: QuestionView[]) => (submit: any, isValid: boolean) => {
  const classes = useStyles();
  return (
    <div className={classes.answerItem}>
      <Form>
        {questions.map((question, idx) => <AnswerQuestionInput key={idx} idx={idx} question={question} />)}
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
  console.log(`cQG: values =- ${JSON.stringify(values)}`)
  const stakes = values.map((v: any) => parseUnits(v.stakeAmount))
  const answerIndexes = values.map((v: any) => v.answerIndex)

  return [questionGroupId, stakes, answerIndexes]
}

const AnswerQuestionGroupForm = ({ questionGroup, onSuccess }: {questionGroup: QuestionGroupView, onSuccess: any}) => {
  const connectedWallet = useContext(WalletContext);
  const defaultValues = questionGroup.questions.map(() => {return {...answerQuestionGroupSchema.defaultValue}})

  const formProps = {
    defaultValues,
    schema: answerQuestionGroupSchema.schema,
    getForm: getForm(questionGroup.questionViews),
    // @ts-ignore    
    contractMethod: connectedWallet.pricingInstance.methods.answerQuestions,
    // @ts-ignore
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(questionGroup.id),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess
  }
  
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default AnswerQuestionGroupForm