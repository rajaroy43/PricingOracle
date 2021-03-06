import React, { useState } from 'react'
import { Form } from 'formik'
import { BigNumber } from 'ethers';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from "@material-ui/core/Typography"
import { answerQuestionGroupSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import { formatUnits, parseUnits } from '../../helpers/formatters'
import AnswerQuestionInput from './AnswerQuestionInput'
import { QuestionView } from '../../types/question'
import { QuestionGroupView } from '../../types/questionGroup'
import { useGetUser } from '../../queries/user'
import { subgraphClient } from '../../client'
import { FormStateEls, SuccessProps } from '../formikTLDR/types';
import ExplorerLink from '../atoms/ExplorerLink';

const useStyles = makeStyles(theme => ({
  answerGroupItems: {
    margin: 0,
    padding: '16px 0 16px 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0'
    },
  },
  totalsColumn: {
    display: 'flex',
    flexBasis: '50%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    padding: '16px !important',
    [theme.breakpoints.down('xs')]: {
        flexBasis: '100%',
        marginLeft: 0,
        padding: 0,
    },
  },
  totalTimeLeft: {
    border: '2px solid #E95F36',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '20px',
    fontWeight: 700,
    marginLeft: '8px',
    marginRight: '8px',
    justifyContent: 'space-between',
    padding: '8px',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  totalPool: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '20px',
    fontWeight: 500,
    justifyContent: 'space-between',
    marginLeft: '8px',
    marginRight: '8px',
    marginTop: '16px',
    padding: '0 10px',
    textAlign: 'right',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  totalStake: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '20px',
    fontWeight: 400,
    justifyContent: 'end',
    marginLeft: '8px',
    marginTop: '16px',
    textAlign: 'right',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  totalPoolLith: {
    fontWeight: 700
  },
  totalPoolUsd: {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 700,
  },
  stakeColumn: {
    alignItems: 'end',
    backgroundColor: '#111111',
    borderRadius: '4px',
    display: 'flex',
    flexBasis: '50%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    padding: '16px !important',
    [theme.breakpoints.down('xs')]: {
        alignItems: 'center',
        flexBasis: '100%',
        marginBottom: '16px',
        marginTop: '16px',
    },
  },
  stakeLithTitle: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
    },
  },
  totalStakeAmount: {
    alignItems: 'center',
    color: '#ffffff !important',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '48px',
    marginRight: '4px',
    textAlign: 'right'
  },
  buttonStake: {
    marginTop: '21px'
  },
  balance: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '8px',
    textAlign: 'right',
    '& span': {
        color: '#E96036'
    }
  }
}));

const mockData = {
  timeLeft: '00:00:00',
  totalBountyDisplayUSD: '-997.55',
  totalStakeDisplayUSD: '-41.55'
}

const Success = ({receipt}: SuccessProps) => (
  <div>
    <Typography variant="h3">Question Answered!</Typography>
    <h5>Tx Confirmed</h5>
    <ExplorerLink txHash={receipt.transactionHash} />
  </div>
)

const getForm = (questionGroup: QuestionGroupView, classes: any, user: any, stakeState: any, setTotalStake: any) => (submit: any, isValid: boolean) => {
  const lithBalance = user ? user.tokenBalanceDisplay : '0';

  const updateStake =  (idx: number) => (stake: number) => {
    const stakes = [...stakeState.stakes]
    stakes[idx] = stake
    const totalStakeReducer = (acc: any, _stake: string) => {
      if (_stake && !isNaN(stake)) { 
        acc = acc.add(parseUnits(_stake));
      } 
      
      return acc
    }

    //@ts-ignore
    const zeroVal = BigNumber.from(0);
    const totalStake = stakes.reduce(totalStakeReducer, zeroVal);
    const totalStakeDisplay = formatUnits(totalStake);
    setTotalStake({
      totalStake,
      totalStakeDisplay,
      stakes
    });
  }

  return (
    <Form>
      <div className={classes.answerGroupItems}>
          {questionGroup.questionViews.map((question: QuestionView, idx: any) => <AnswerQuestionInput key={question.id} idx={idx} question={question} updateStake={updateStake(idx)} />)}
      </div>

      <Grid container>
        <Grid item md={6} sm={6} xs={12} className={classes.totalsColumn}>
            {false && <div className={classes.totalTimeLeft}>Time left: <span>{mockData.timeLeft}</span></div>}
            <div className={classes.totalPool}>Total Pool: 
                <div>
                    <div className={classes.totalPoolLith}>{questionGroup.totalBountyDisplay} $LITH</div>
                    { /* <div className={classes.totalPoolUsd}>~{mockData.totalBountyDisplayUSD}</div> */}
                </div>
            </div>                   
        </Grid>
        <Grid item md={6} sm={6} xs={12} className={classes.stakeColumn}>
            <Typography variant="h3" className={classes.stakeLithTitle} noWrap={true}>Stake $LITH on your answers</Typography>
            <div className={classes.totalStake}>Total Stake:&nbsp; 
                <div className={classes.total}>
                    <div className={classes.totalPoolLith}>{stakeState.totalStakeDisplay} $LITH</div>
                    { /* <div className={classes.totalPoolUsd}>~{mockData.totalStakeDisplayUSD}USD</div> */}
                </div>
            </div> 
            <div className={classes.balance}>
                Balance: {lithBalance} $LITH
            </div>
            <Button
              label="Stake &amp; Submit"
              className={classes.buttonStake}
              onClick={submit}
              disabled={!isValid}
            />
        </Grid>
      </Grid>
    </Form>
  )
} 

const getMethodArgs = (questionGroupId: string) => (values: any) => {
  const stakes = values.answers.map((v: any) => parseUnits(v.stakeAmount))
  const answerIndexes = values.answers.map((v: any) => parseInt(v.answerIndex, 10))

  return [questionGroupId, stakes, answerIndexes]
}

const AnswerQuestionGroupForm = ({ questionGroup, connectedWallet }: {questionGroup: QuestionGroupView, connectedWallet: any}) => {
  const classes = useStyles();
  const defaultQuestionValues = questionGroup.questions.map(() => {
    return {...answerQuestionGroupSchema.defaultValue}
  })
  const { user } = useGetUser(subgraphClient, connectedWallet.address);
  const initialStakeState = {
    totalStake: "0",
    totalStakeDisplay: "0.0",
    stakes: questionGroup.questions.map(() => 0) 
  }
  const [stakeState, setTotalStake] = useState(initialStakeState)
  const stateEls: FormStateEls =  {
    SuccessEl: Success
  }
  const formProps = {
    defaultValues: {answers: defaultQuestionValues },
    schema: answerQuestionGroupSchema.schema,
    getForm: getForm(questionGroup, classes, user, stakeState, setTotalStake),
    contractMethod: connectedWallet.pricingInstance.methods.answerQuestions,
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(questionGroup.id),
    stateEls,
    updaters: {}
  }
  
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default AnswerQuestionGroupForm