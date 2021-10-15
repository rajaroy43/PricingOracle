import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import { WalletContext } from '../providers/WalletProvider'
import ClaimRewardForm from '../forms/ClaimReward'

const useStyles = makeStyles(theme => ({
  questionGroupItem: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '32px',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
  },
  questionGroupColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 0,
    [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginTop: '16px',
        width: '100%'
    },
  },
  questionGroupRightColumn: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 0,
    [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginTop: '16px',
        width: '100%'
    },
  },
  questionGroupWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  },
  questionGroupCategory: {
    backgroundColor:'#333333',
    borderRadius: '4px',
    color: 'white',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 600,
    padding: '8px',
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px'
    }    
  },
  questionGroupLength: {
    color: 'white',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 600,
    marginLeft: '8px',
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      marginTop: '8px'
    }
  },
  questionGroupTime: {
    alignSelf: 'flex-end',
    border: '2px solid #E95F36',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 700,
    marginTop: '4px',
    justifySelf: 'end',
    textAlign: 'right',
    padding: '4px',
    width: 'fit-content'
  },
  questionGroupPool: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '16px',
    textAlign: 'right',
    padding: '4px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '8px',
      justifyContent: 'space-between',
      width: '100%'
    }
  },
  questionPoolValue: {
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifySelf: 'end'
    }
  },
  questionGroupStake: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 500,
    marginTop: '8px',
    textAlign: 'right',
    padding: '4px',
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '8px',
        justifyContent: 'space-between',
        width: '100%'
    }
  },  
  questionStakeValue: {
    fontSize: '16px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifySelf: 'end'
    }
  },
  questionGroupEarnings: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 700,
    textAlign: 'right',
    padding: '4px',
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
  },  
  questionEarningsValue: {
    color: '#E96036',
    fontSize: '16px',
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
    }
  }
}));

export const AnswerGroupStatus = ({ walletAddress, pricingInstance, answerGroup}: {walletAddress: any, pricingInstance: any, answerGroup: any}) => {
    // const classes = useStyles();

    return (answerGroup.isRewardCalculated === "Calculated" && answerGroup.status === "Unclaimed") ? 
        <ClaimRewardForm
            connectedAddress={walletAddress}
            pricingInstance={pricingInstance}
            answerGroupIds={answerGroup.claimableIds}
        />
    :
    null
    // TODO: Enable once timer functionality is implemented
    /* <div className={classes.questionGroupTime}>Time left: 00:00:00</div> */
}

const AnswerGroupItem = ({answerGroup}: {answerGroup: any}) => {
  const classes = useStyles();
  // @ts-ignore
  const { walletAddress, pricingInstance } = useContext(WalletContext);

  return (
    <div className={classes.questionGroupItem}> 
      <div className={classes.questionGroupColumn}>
        <Typography variant="h3">Group #{answerGroup.questionGroupView.id}</Typography>
        <div className={classes.questionGroupWrapper}>
          <div className={classes.questionGroupCategory}>{answerGroup.questionGroupView.category.label}</div>
          <div className={classes.questionGroupLength}>{answerGroup.answers.length} Questions</div>
        </div>
      </div>

      <div className={classes.questionGroupRightColumn}>
        <AnswerGroupStatus walletAddress={walletAddress} pricingInstance={pricingInstance} answerGroup={answerGroup} />
        <div className={classes.questionGroupPool}>Total Pool: <span className={classes.questionPoolValue}>{answerGroup.questionGroupView.totalBountyDisplay} $LITH</span></div>
        <div className={classes.questionGroupStake}>My Stake: <span className={classes.questionStakeValue}>{answerGroup.totalStakeDisplay} $LITH</span></div>
        <div className={classes.questionGroupEarnings}>Earnings: <span className={classes.questionEarningsValue}>{answerGroup.earningsDisplay} $LITH</span></div>
      </div>
    </div>
  )
}

export default AnswerGroupItem