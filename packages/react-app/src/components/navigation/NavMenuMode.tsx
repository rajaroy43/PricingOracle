import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    modeToggleGroup: {
      border: '1px solid #E96036',
      margin: '16px 0 0 0',
      '& .MuiToggleButton-label': {
          color: '#000',
          flexDirection: 'column',
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: '16px',
          textTransform: 'none',
          '& > span': {
            fontSize: '12px',
            lineHeight: '12px',
            marginTop: '4px'
          }
      },
      width: '100%'
    },
    title: {
      marginTop: '4px'
    },
    modeToggleButton: {
      width: '50%'
    }
})); 

const ToggleMode = ({initialMode}: {initialMode: string}) => {
  const history = useHistory();
  const classes = useStyles();
  const [mode, setMode] = useState(initialMode);
  
  return (
    <ToggleButtonGroup
      className={classes.modeToggleGroup}
      value={mode}
      exclusive
      onChange={(event, newMode) => {
        if (newMode !== null) {
          setMode(newMode);
          if (newMode === 'node') {
            history.push('/wisdom-node/available-questions');
          } 
          if (newMode === 'seeker') { 
            history.push('/wisdom-seeker/design')            
          }
        }
      }}
      aria-label="mode"
    >
      <ToggleButton value="node" aria-label="Ask Questions" className={classes.modeToggleButton}>
        Answer Questions<br />
        <span>Select to price assets<br />
        and Earn LITH</span>
        <span className={classes.title}>Wisdom Node</span>
      </ToggleButton>
      <ToggleButton value="seeker" aria-label="Answer Questions" className={classes.modeToggleButton}>
        Ask Questions<br />
        <span>Select to request<br />
        assets to price</span>
        <span className={classes.title}>Wisdom Seeker</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleMode
