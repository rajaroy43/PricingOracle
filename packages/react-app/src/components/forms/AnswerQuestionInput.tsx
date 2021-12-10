import React from 'react'
import { makeStyles } from '@material-ui/core'
import Text from '../atoms/inputs/Text'
import RadioUI from '../atoms/inputs/Radio'

const useStyles = makeStyles(theme => ({
  answerItem: {
    backgroundColor: '#111111',
    borderRadius: '4px',
    '& p': {
      fontFamily: [
        'Rajdhani',
        'sans-serif'
      ].join(', '),
      fontSize: '18px',
      fontWeight: '500',
      marginTop: 0
    },
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
    padding: '24px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '16px',
      padding: '16px'
    },
  },
  answerItemInput: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginLeft: '48px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'end',
      marginLeft: '16px',
      marginTop: '16px',
    },
  },
  stakeAmount: {
    alignItems: 'center',
    color: '#ffffff !important',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginRight: '4px',
    textAlign: 'right',
    width: '160px'
  },
  stakeMinimum: {
    marginLeft: '16px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '16px'
    }
  },
  error: {
    color: '#ff0000',
    fontWeight: 700,
    position: 'relative',
    top: '32px',
    left: '-255px',
    [theme.breakpoints.down('xs')]: {
      top: '16px',
      left: '18px'
    }
  }
}));

const radioOptions = [
  {
    label: "No",
    value: "0"
  },
  {
    label: "Yes",
    value: "1"
  }
]

const radioStyle = {
  flexDirection: 'row',
  justifyContent: 'start',
}

const inputProps = {
  width: '44px'
}

const inputLabelProps = {
  disableAnimation: true, 
  shrink: false,
  style: {marginRight: '8px'}
}

const AnswerQuestionInput = ({
  question,
  idx,
  updateStake
}: any) => {
  const classes = useStyles();
  return (
    <div className={classes.answerItem}>
      <p>{question.description} equal to or above $<span style={{fontWeight: 700}}>{question.answerSetDisplay[1]}</span> on {question.pricingTimeDisplay}?</p>

      <div className={classes.answerItemInput}>
        <RadioUI
          name={`[answers[${idx}].answerIndex]`}
          options={radioOptions}
          style={radioStyle}
        />

        <Text
          onChange={(value:any) => { updateStake(value)}}
          wrapperClass={classes.stakeAmountWrapper}
          className={classes.stakeAmount}
          label="Stake Amount:"
          name={`[answers[${idx}].stakeAmount]`}
          type="float"
          InputProps={inputProps}
          InputLabelProps={inputLabelProps}
          errorCss={classes.error}
          followText="$LITH &nbsp; &nbsp; 1 LITH Minimum Stake"
        />
      </div>
    </div>
  )
}

export default AnswerQuestionInput
