import React from "react";
import Grid from '@material-ui/core/Grid';
import SideBar from './pages/SideBar'

const Template = (props: any) => {
    return (
        <Grid container>
            <Grid item md={3} xs={12}><SideBar {...props} /></Grid>
            <Grid item md={9} xs={12}>
                { props.children }
            </Grid>
        </Grid>
    )
}

export default Template