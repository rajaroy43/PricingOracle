import React from 'react'
import lithiumLogo from '../assets/logo-lithium.svg';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  marketingIntro: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '32px',
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
        marginBottom: '16px'
    },
  },
  logo: {
    width: '350px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px',
      width: '270px'
    },
  },
  homeSubheading: {
    fontSize: '18px',
    fontWeight: 700,
    marginTop: '16px',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%'
  },
  homeMarketingText: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '18px',
    marginTop: '16px',
    maxWidth: '520px',
    textAlign: 'center',
    width: '100%'    
  }
}));

const MarketingIntro = () => {
  const classes = useStyles();

  return (
    <div className={classes.marketingIntro}>
      <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
      <Typography variant="h1" className={classes.homeSubheading}>Lithium Finance uses collective intelligence to price the unpriced</Typography>
      <Typography variant="h2" className={classes.homeMarketingText}>
          Lithium Protocol prices illiquid assets quickly and inexpensively, enabling price discovery for illiquid assets, just like stocks. 
          Lithium Protocol's unique consensus mechanism sets the foundation for real assets x DeFi.
      </Typography>
    </div>
  )
}

export default MarketingIntro