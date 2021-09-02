import React from 'react'
import Blockies from 'react-blockies';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  blockies: {
    borderRadius: '50%',
    height: '32px',
    width: '32px'
  },
}));

const Blockie = ({address, size, scale}) => {
  const classes = useStyles();

  return (
    <Blockies
      className={classes.blockies}
      scale={scale || 3}    
      seed={address}
      size={size || 10}
    />
  );
}

export default Blockie