import React from 'react'
import { loadCSS } from 'fg-loadcss'
import { makeStyles } from '@material-ui/core/styles'
import { Icon, Link } from '@material-ui/core'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({});

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    [breakpoints.down('xs')]: {
      flexWrap: 'wrap',
      justifyContent: 'start'
    }
  },
  socialLabel: {
    alignSelf: 'end', 
    margin: '0 20px 0 0',
    [breakpoints.down('xs')]: {
      display: 'none'
    }  
  },
  socialLink: {
    margin: '0 20px 0 0',
    [breakpoints.down('xs')]: {
      margin: '0 16px 0 0'
    } 
  }
}));

export default function SocialIcons() {
  const classes = useStyles();

  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.socialLabel}>SOCIAL</div> 
      <Link href="https://twitter.com/lithiumfinance" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-twitter" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://www.linkedin.com/company/lithium-finance" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-linkedin" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://www.youtube.com/channel/UC7fyPLRGXNlSsAParxE8NvA" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-youtube" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://github.com/LithiumFinance" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-github" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://medium.com/lithiumfinance" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-medium" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://lith.finance/community/" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fab fa-telegram" style={{ color: 'white', fontSize: '20px' }} /></Link>
      <Link href="https://lith.finance/community/" target="_blank" rel="noopener" className={classes.socialLink}><Icon className="fa fa-ellipsis-h" style={{ color: '#E96036', fontSize: '14px' }} /></Link>
    </div>
  );
}