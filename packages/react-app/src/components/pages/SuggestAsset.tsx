import React, { useContext } from 'react'
import SuggestAssetForm from '../forms/SuggestAssetForm'
import { WalletContext } from '../providers/WalletProvider'
import WisdomSeekerTemplate from '../templates/WisdomSeekerTemplate'

const SuggestAsset = () => {
    const {wallet} = useContext(WalletContext)
    const sideBarProps = {
        activePage: 'suggestAsset',
        // @ts-ignore
        isWalletConnected: !!wallet,
        // @ts-ignore
        walletAddress: wallet ? wallet.address : undefined
    }

    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <SuggestAssetForm />
        </WisdomSeekerTemplate>
    )
}

export default SuggestAsset