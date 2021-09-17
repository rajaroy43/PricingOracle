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
    color: '#ffffff !important',
    flexWrap: 'nowrap',
    marginRight: '4px',
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

const AnswerQuestionInput = ({
  question,
  idx
}: any) => {
  const classes = useStyles();
  return (
    <div className={classes.answerItem}>
      <p>{question.description} equal to or above <span style={{fontWeight: 700}}>{question.answerSet[1]}</span> on {question.pricingTimeDisplay}?</p>

      <div className={classes.answerItemInput}>
        <RadioUI
          defaultValue="no"
          name={`update${idx}`}
          options={radioOptions}
          style={radioStyle}
        />

        <Text
          wrapperClass={classes.stakeAmountWrapper}
          className={classes.stakeAmount}
          label="Stake Amount:"
          name={`stakeAmount${idx}`}
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
