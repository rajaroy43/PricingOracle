import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { PageParams } from "../../types/navigation";
import getNavItems from "../sidebars/wisdomNode/navMenuConfig";
import ConnectedSideBar from '../sidebars/wisdomNode/ConnectedSideBar'
import NotConnectedSideBar from '../sidebars/wisdomNode/NotConnectedSideBar'
import Footer from "../Footer";

const useStyles = makeStyles(theme => ({
    mainContent: {
      margin: 0,
      padding: '24px',
      [theme.breakpoints.down('sm')]: {
        paddingTop: 0
      },
    },
    mainWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh'
    }
  })); 

const WisdomNodeTemplate = ({pageProps, children}: {pageProps: PageParams, children: any}) => {
    const classes = useStyles();
    const [isDrawerOpen, setDrawerOpen] = useState(false); 
    const displaySideBar = (pageProps.isWalletConnected) ? <ConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} /> : <NotConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
    return (
        <div className={classes.mainWrapper}>
          <Grid container>
              <Grid item md={3} xs={12}>{ displaySideBar }</Grid>
              <Grid item md={9} xs={12} className={classes.mainContent}>
                  { children }
              </Grid>
          </Grid>
          <Footer />
        </div>
    )
}

export default WisdomNodeTemplate