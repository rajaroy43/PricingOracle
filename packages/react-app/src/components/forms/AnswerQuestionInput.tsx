import React from 'react'
import Text from '../atoms/inputs/Text'
import RadioUI from '../atoms/inputs/Radio'
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
      <p>{question.description} equal to or above <span style={{fontWeight: 700}}>{question.answerSet[1]}</span> on {question.pricingTimeDisplay}?</p>

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
          InputLabelProps={inputLabelProps}
          errorCss={classes.error}
          followText="$LITH"
        />
      </div>
    </div>
  )
}

export default AnswerQuestionInput
