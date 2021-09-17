import React, { useContext } from 'react'
import { Form } from 'formik'
import { WalletContext } from '../providers/WalletProvider'
import { answerQuestionGroupSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Typography from "@material-ui/core/Typography"
import Text from '../atoms/inputs/Text'
import RadioUI from '../atoms/inputs/Radio'
import Button from '../atoms/inputs/buttons/Button'
import { parseUnits } from '../../helpers/formatters'
import { makeStyles } from '@material-ui/core'

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

const getForm = (questionDescription: string, questionPricingTimeDisplay: string, answer: any) => (submit: any, isValid: boolean) => {
  const classes = useStyles();
  return (
    <div className={classes.answerItem}>
      <Form>
        <p>{questionDescription} equal to or above <span style={{fontWeight: 700}}>{answer}</span> on {questionPricingTimeDisplay}?</p>

        <div className={classes.answerItemInput}>
          <RadioUI
            defaultValue="no"
            name="update"
            options={radioOptions}
            style={radioStyle}
          />

          <Text
            wrapperClass={classes.stakeAmountWrapper}
            className={classes.stakeAmount}
            label="Stake Amount:"
            name="stakeAmount"
            type="float"
            InputLabelProps={inputLabelProps}
            errorCss={classes.error}
            followText="%"
          />
        </div>

        <Button
          label="Submit Answer"
          onClick={submit}
          disabled={!isValid}
        />
      </Form>
    </div>
  )
} 

const getMethodArgs = (questionId: string) => (values: any) => {
  const parsedStake = parseUnits(values.stakeAmount)
  console.log(`parsed stake is ${parsedStake}`)
  return [[questionId], [parsedStake], [values.answerIndex]]
}

export const generateAnswerSetOptions = (answerSet: string[]) => {
  return answerSet.map((answer: string, index: number) => {
    if (index === answerSet.length - 1) {
      return {label: `Greater Than or Equal to ${answer}`, value: index}
    } else {
      return {label: `Greater Than or Equal to ${answer} or  Less Than ${answerSet[index+1]}`, value: index}
    }
  })
}

const AnswerQuestionForm = ({ question, onSuccess }: any) => {
  const connectedWallet = useContext(WalletContext);
  // @ts-ignore
  console.log(`contract methods ${Object.keys(connectedWallet.pricingInstance.methods)}`)

  const formProps = {
    defaultValues: {},
    schema: {},
    getForm: getForm(question.description, question.pricingTimeDisplay, question.answerSet[1]),
    // @ts-ignore    
    contractMethod: connectedWallet.pricingInstance.methods.answerQuestions,
    // @ts-ignore
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(question.id),
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

export default AnswerQuestionForm