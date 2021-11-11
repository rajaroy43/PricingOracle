import React, { useContext } from 'react'
import { WalletContext } from '../providers/WalletProvider'
import WisdomSeekerTemplate from '../templates/WisdomSeekerTemplate'
import SuggestAssetForm from '../forms/SuggestAssetForm'

const SuggestAsset = ({ match }: any) => {
    const connectedWallet = useContext(WalletContext)
    const sideBarProps = {
        activePage: 'suggestAsset',
        // @ts-ignore
        isWalletConnected: !!connectedWallet.wallet,
        // @ts-ignore
        walletAddress: connectedWallet.address
    }

    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <SuggestAssetForm />
        </WisdomSeekerTemplate>
    )
}

export default SuggestAsset