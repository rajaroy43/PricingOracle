import React, { useContext } from 'react'
import { WalletContext } from '../providers/WalletProvider'
import { subgraphClient } from '../../client'
import { useGetQuestionGroup, useGetQuestionGroupAndUserAnswer } from '../../queries/questionGroup'
import LoadingCircle from '../atoms/Loading'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import AnsweringGroup from '../questions/AnsweringGroup'

const Answering = ({ match}: any)=> {
    const urlQuestionGroupId = match.params.questionGroupId;
    const {wallet} = useContext(WalletContext)
    const {loading, questionGroup} = useGetQuestionGroupAndUserAnswer(subgraphClient, urlQuestionGroupId, wallet.address || '0x0')

    const sideBarProps = {
        activePage: 'availableQuestions',
        isWalletConnected: !!wallet.wallet,
        walletAddress: wallet.address
    }
    return (
        <WisdomNodeTemplate pageProps={sideBarProps}>
            { 
            !wallet.wallet ? <h3>Connect Wallet to Answer Questions</h3> : 
                loading ?
                    <LoadingCircle />
                    :
                    questionGroup ? wallet.wallet && <AnsweringGroup questionGroup={questionGroup} connectedWallet={wallet} /> : null
                
            }
        </WisdomNodeTemplate>
    )
}

export default Answering