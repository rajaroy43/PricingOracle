import React from "react"
import { Grid, Link } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"
import SocialIcons from "./atoms/icons/SocialIcons"

const breakpoints = createBreakpoints({})

const useStyles = makeStyles(theme => ({
    footerLeft: {
      flexDirection: 'column',
      justifyContent: 'start',
      margin: 0,
      padding: '24px 24px 0 24px',
      '& > p': {
        fontSize: '14px',
        letterSpacing: '1px',
        margin: '0 0 16px 0',
        [breakpoints.down('sm')]: {
            fontSize: '12px',
            lineHeight: '16px'
        }
      }
    },
    footerRight: {
        alignItems: 'start',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        margin: 0,
        padding: '24px 24px 0 24px',
        [breakpoints.down('sm')]: {
            alignItems: 'unset',
            flexDirection: 'column',
            justifyContent: 'start',
            margin: '0 24px 16px 24px',
            padding: 0
        }, 
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
        marginBottom: '14px',
    },
    webLinkLabel: {
        [breakpoints.down('xs')]: {
            display: 'none'
        } 
    },
    webLink: {
        marginLeft: '20px',
        [breakpoints.down('sm')]: {
            marginLeft: 0,
        }, 
    }
  })); 

const Footer = () => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item md={6} xs={12} className={classes.footerLeft}>
                <p>Lithium Finance &copy; {(new Date().getFullYear())}. All Rights Reserved</p>
            </Grid>
            <Grid item md={6} xs={12} className={classes.footerRight}>
                <div className={classes.wrapper}>
                    <div className={classes.webLinkWrapper}><span className={classes.webLinkLabel}>WEB &nbsp; </span><Link href="https://lith.finance" target="_blank" rel="noopener" className={classes.webLink}>lith.finance</Link></div>
                    <SocialIcons />
                </div>
            </Grid>
        </Grid>
    )
}

export default Footer