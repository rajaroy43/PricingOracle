import React from "react";
import Grid from '@material-ui/core/Grid';
import { PageParams } from "../../types/navigation";
import getNavItems from "../sidebars/wisdomNode/navMenuConfig";
import ConnectedSideBar from '../sidebars/wisdomNode/ConnectedSideBar'
import NotConnectedSideBar from '../sidebars/wisdomNode/NotConnectedSideBar'

const WisdomNodeTemplate = ({pageProps, children}: {pageProps: PageParams, children: any}) => {
    const displaySideBar = (pageProps.isWalletConnected) ? <ConnectedSideBar navMenu={pageProps} getNavItems={getNavItems} /> : <NotConnectedSideBar navMenu={pageProps} getNavItems={getNavItems} />
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