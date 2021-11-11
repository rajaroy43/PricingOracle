import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { PageParams } from "../../types/navigation";
import getNavItems from "../sidebars/wisdomSeeker/navMenuConfig";
import ConnectedSideBar from '../sidebars/wisdomSeeker/ConnectedSideBar'
import NotConnectedSideBar from '../sidebars/wisdomSeeker/NotConnectedSideBar'

const useStyles = makeStyles(theme => ({
    mainContent: {
      margin: 0,
      padding: '24px',
      [theme.breakpoints.down('sm')]: {
        paddingTop: 0
      },
    }
  })); 

const WisdomSeekerTemplate = ({pageProps, children}: {pageProps: PageParams, children: any}) => {
    const classes = useStyles();
    const [isDrawerOpen, setDrawerOpen] = useState(false); 
    
    const displaySideBar = (pageProps.isWalletConnected) ? <ConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} /> : <NotConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />;

   return (
        <Grid container>
            <Grid item md={3} xs={12}>{ displaySideBar }</Grid>
            <Grid item md={9} xs={12} className={classes.mainContent}>
                { children }
            </Grid>
        </Grid>
    )
}

export default WisdomSeekerTemplate