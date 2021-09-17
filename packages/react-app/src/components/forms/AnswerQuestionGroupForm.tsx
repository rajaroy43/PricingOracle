import React, { useContext } from 'react'
import { Form } from 'formik'
import { WalletContext } from '../providers/WalletProvider'
import { answerQuestionGroupSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import Button from '../atoms/inputs/buttons/Button'
import Grid from '@material-ui/core/Grid'
import { parseUnits } from '../../helpers/formatters'
import AnswerQuestionInput from './AnswerQuestionInput'
import { QuestionView } from '../../types/question'
import { QuestionGroupView } from '../../types/questionGroup'

const Success = () => (
  <div>
    <Typography variant="h3">Question Answered!</Typography>
  </div>
)

const useStyles = makeStyles(theme => ({
  timeCol: {
    alignSelf: 'end',
    display: 'flex',
    justifyContent: 'end',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
        display: 'none',
    },
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
  bottomRow: {
    flexWrap: 'nowrap',
    marginTop: '16px',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap'
    },
  },
  totalsColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    padding: '16px !important',
    [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        padding: 0,
    },
  },
  totalTimeLeft: {
    border: '2px solid #E95F36',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Rajdhani',
    fontSize: '20px',
    fontWeight: 700,
    justifyContent: 'space-between',
    padding: '8px',
    width: '100%'
  },
  totalPool: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Rajdhani',
    fontSize: '20px',
    fontWeight: 400,
    justifyContent: 'space-between',
    marginTop: '16px',
    padding: '0 10px',
    textAlign: 'right',
    width: '100%'
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
    flexBasis: '49%',
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
    fontFamily: 'Rajdhani',
    fontSize: '24px',
    fontWeight: 500,
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
    },
  },
  stakeLithTotalForm: {
    marginTop: '24px'
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
  errorTotalStakeAmount: {
    color: '#ff0000',
    position: 'relative',
    top: '32px',
    left: '-64px'
  },
  balance: {
    fontFamily: 'Rajdhani',
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '8px',
    textAlign: 'right',
    '& span': {
        color: '#E96036'
    }
  },
  buttonStakeSubmit: {
    marginTop: '16px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '24px',
    },
  }
}));

const getForm = (questions: QuestionView[]) => (submit: any, isValid: boolean) => {
  const classes = useStyles();
  return (
    <>
      <Form>
        {questions.map((question, idx) => <AnswerQuestionInput key={idx} idx={idx} question={question} />)}
        
        <Grid container className={classes.bottomRow} spacing={2}>
            <Grid item md={6} sm={6} xs={12} className={classes.totalsColumn}>
                <div className={classes.totalTimeLeft}>Time left: <span>00:00:00</span></div> 
                <div className={classes.totalPool}>Total Pool: 
                    <div>
                        <div className={classes.totalPoolLith}>1000 $LITH</div>
                        <div className={classes.totalPoolUsd}>~997.55 USD</div>
                    </div>
                </div>
                <div className={classes.totalPool}>Total Stake: 
                    <div>
                        <div className={classes.totalPoolLith}>42 $LITH</div>
                        <div className={classes.totalPoolUsd}>~41.55 USD</div>
                    </div>
                </div>                    
            </Grid>
            <Grid item md={6} sm={6} xs={12} className={classes.stakeColumn}>
                <Typography variant="h3" className={classes.stakeLithTitle} noWrap={true}>Stake $LITH on your answers:</Typography>
                <div className={classes.stakeLithTotalForm}>
                    <img src={require(`../../assets/icon-lithium.svg`)} alt="Lithium" /> 
                </div>
                <div className={classes.balance}>
                    Balance: 00000.00 $LITH <span>(Max)</span>
                </div>
                <Button
                  className={classes.buttonStakeSubmit}
                  label="Stake &amp; Submit"
                  onClick={submit}
                  disabled={!isValid}
                />
            </Grid>
        </Grid>
      </Form>
    </>
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