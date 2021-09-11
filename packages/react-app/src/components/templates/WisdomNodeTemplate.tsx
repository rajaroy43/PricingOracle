import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import { PageParams } from "../../types/navigation";
import getNavItems from "../sidebars/wisdomNode/navMenuConfig";
import ConnectedSideBar from '../sidebars/wisdomNode/ConnectedSideBar'
import NotConnectedSideBar from '../sidebars/wisdomNode/NotConnectedSideBar'

const WisdomNodeTemplate = ({pageProps, children}: {pageProps: PageParams, children: any}) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false); 
    
    const displaySideBar = (pageProps.isWalletConnected) ? <ConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} /> : <NotConnectedSideBar pageParams={pageProps} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
    return (
        <Grid container>
            <Grid item md={3} xs={12}>{ displaySideBar }</Grid>
            <Grid item md={9} xs={12}>
                { children }
            </Grid>
        </Grid>
    )
}

export default WisdomNodeTemplate