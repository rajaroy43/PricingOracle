import React from 'react'
import { Grid, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SocialIcons from './atoms/icons/SocialIcons'

const useStyles = makeStyles(theme => ({
    footerLeft: {
      margin: 0,
      padding: '24px',
      flexDirection: 'column',
      '& > p': {
        fontSize: '14px',
        letterSpacing: '1px'
      }
    },
    footerRight: {
        alignItems: 'end',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        margin: 0,
        padding: '32px 48px 24px 24px',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        marginBottom: '16px',
        width: 'fit-content'
    },
    webLinkWrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '8px',
    },
    webLink: {
        marginLeft: '20px'
    }
  })); 

const Footer = () => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item md={6} xs={6} className={classes.footerLeft}>
                <p>Incubated by Liquefy Labs</p>
                <p>Lithium Finance &copy; {(new Date().getFullYear())}. All Rights Reserved</p>
            </Grid>
            <Grid item md={6} xs={6} className={classes.footerRight}>
                <div className={classes.wrapper}>
                    <div className={classes.webLinkWrapper}>WEB &nbsp; <Link href="https://lith.finance" target="_blank" rel="noopener" className={classes.webLink}>lith.finance</Link></div>
                    <SocialIcons />
                </div>
            </Grid>
        </Grid>
    )
}

export default Footer;

