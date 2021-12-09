import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  questionGroupTime: {
    alignSelf: 'flex-end',
    border: '2px solid #E95F36',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '20px',
    fontWeight: 700,
    marginRight: '2px',
    marginTop: '4px',
    justifySelf: 'end',
    textAlign: 'left',
    padding: '6px 8px',
    width: '176px'
  },
}));

const TimeLeft = ({targetTime, label}: {targetTime: number, label: string}) => {
  const targetTimeMS = new Date(targetTime).getTime()
  const classes = useStyles()
  const [currentTime, setCurrentTime] = useState(new Date().getTime())
  const timeDelta = targetTimeMS - currentTime
  const remainingTime = new Date(timeDelta < 0 ? 0 : timeDelta)
  useEffect(
    () => {
      const interval = 
        setInterval(() => {
          setCurrentTime(new Date().getTime());
        }, 1000)

      return function cleanup() {
        clearInterval(interval);
      };
    },
    []
  )
  
  return (
    <div className={classes.questionGroupTime}>
      {label}: {("0" + remainingTime.getUTCHours()).slice(-2)}:{("0" + remainingTime.getUTCMinutes()).slice(-2)}:{("0" + remainingTime.getUTCSeconds()).slice(-2)}
    </div>
  )
}

export default TimeLeft