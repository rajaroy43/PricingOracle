import React, { useContext } from 'react'
import SuggestAssetForm from '../forms/SuggestAssetForm'
import { WalletContext } from '../providers/WalletProvider'
import WisdomSeekerTemplate from '../templates/WisdomSeekerTemplate'

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