import React, { useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

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

const ToggleMode = () => {
  const classes = useStyles();
  const [mode, setMode] = useState('node');

  return (
    <ToggleButtonGroup
      className={classes.modeToggleGroup}
      value={mode}
      exclusive
      onChange={(event, newMode) => {
        setMode(newMode);
        console.log('event', event);
        console.log('newMode', newMode);
      }}
      aria-label="mode"
    >
      <ToggleButton value="seeker" aria-label="Ask Questions" className={classes.modeToggleButton}>
        Answer Questions<br />
        <span>Select to price assets<br />
        and Earn LITH</span>
        <span className={classes.title}>Wisdom Node</span>
      </ToggleButton>
      <ToggleButton value="node" aria-label="Answer Questions" className={classes.modeToggleButton}>
        Ask Questions<br />
        <span>Select to request<br />
        assets to price</span>
        <span className={classes.title}>Wisdom Seeker</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleMode
