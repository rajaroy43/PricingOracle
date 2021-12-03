import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { WalletContext } from '../../providers/WalletProvider'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'
import MyBidsOpenList from '../../bids/MyBidsOpenList'
import MyBidsClosedList from '../../bids/MyBidsClosedList'

const MyBids = ({ match }: any) => {
    const {wallet} = useContext(WalletContext)

    const sideBarProps = {
        activePage: 'myBids',
        isWalletConnected: !!wallet.wallet,
        walletAddress: wallet.address
    }

    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <Typography variant="h1">My Bids</Typography>

            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <MyBidsOpenList connectedWallet={wallet} />
                    <MyBidsClosedList connectedWallet={wallet} />
                </Grid>
            </Grid>
        </WisdomSeekerTemplate>
    )
}

export default MyBids