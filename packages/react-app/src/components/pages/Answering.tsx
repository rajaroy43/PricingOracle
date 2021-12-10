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
    const walletAddress = wallet ? wallet.address : '0x0'
    const {loading, questionGroup} = useGetQuestionGroupAndUserAnswer(subgraphClient, urlQuestionGroupId, walletAddress)

    const sideBarProps = {
        activePage: 'availableQuestions',
        isWalletConnected: !!wallet,
        walletAddress: wallet ? wallet.address : undefined
    }
    return (
        <WisdomNodeTemplate pageProps={sideBarProps}>
            { 
            !wallet ? <h3>Connect Wallet to Answer Questions</h3> : 
                loading ?
                    <LoadingCircle />
                    :
                    questionGroup ?
                      <AnsweringGroup questionGroup={questionGroup} connectedWallet={wallet} />
                      :
                      <div>Error loading page, please refresh</div>
                
            }
        </WisdomNodeTemplate>
    )
}

export default Answering