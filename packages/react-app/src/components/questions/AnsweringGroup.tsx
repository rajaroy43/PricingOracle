import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// TODO: Make AnswerGroupView
// import { QuestionGroupView } from '../../types/questionGroup'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography"
import Grid from '@material-ui/core/Grid'
import { Link as RouterLink } from 'react-router-dom'
import AnswerQuestionGroupForm from '../forms/AnswerQuestionGroupForm'
import { QuestionGroupView } from '../../types/questionGroup'
import { useGetUser } from '../../queries/user'
import { subgraphClient } from '../../client'

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
  balance: {
    fontFamily: 'Rajdhani',
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '8px',
    textAlign: 'right',
    '& span': {
        color: '#E96036'
    }
  }
}));

const inputLabelProps = {
    disableAnimation: true, 
    shrink: false,
    style: {marginRight: '8px'}
}

const AnsweringGroup = ({questionGroup, connectedWallet}: {questionGroup: QuestionGroupView, connectedWallet: any}) => {
  const classes = useStyles();
  const {loading, user} = useGetUser(subgraphClient, connectedWallet.address)

  const lithBalance = user ? user.tokenBalanceDisplay : '-'

  const initialStakeState = {
    totalStake: "0",
    stakes: questionGroup.questions.map(() => 0)
  }

  const [stakeState, setTotalStake] = useState(initialStakeState)
  const updateStake =  (idx: number) => (stake: number) => {
    //@ts-ignore
    console.log(` updating stakes with - ${stake}`)
    const stakes = [...stakeState.stakes]
    stakes[idx] = stake
    //@ts-ignore
    const totalStake = stakes.reduce((acc: number, stake: number) => acc + parseInt(stake, 10), 0).toString()
    setTotalStake({
      totalStake,
      stakes
    })

  }
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
            <AnswerQuestionGroupForm questionGroup={questionGroup} connectedWallet={connectedWallet} updateStake={updateStake} />
            :
            <div>No Question Groups</div>
            }
        </div>

        <Grid container>
            <Grid item md={6} sm={6} xs={12} className={classes.totalsColumn}>
                <div className={classes.totalTimeLeft}>Time left: <span>00:00:00</span></div> 
                <div className={classes.totalPool}>Total Pool: 
                    <div>
                        <div className={classes.totalPoolLith}>{questionGroup.totalBountyDisplay} $LITH</div>
                        <div className={classes.totalPoolUsd}>~997.55 USD</div>
                    </div>
                </div>
                <div className={classes.totalPool}>Total Stake: 
                    <div>
                        <div className={classes.totalPoolLith}>{stakeState.totalStake} $LITH</div>
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
                    Balance: {lithBalance} $LITH <span>(Max)</span>
                </div>
            </Grid>
        </Grid>
    </>
  )
}

export default AnsweringGroup