import React, { useContext } from 'react'
import { WalletContext } from '../providers/WalletProvider'
import { subgraphClient } from '../../client'
import { useGetQuestionGroup } from '../../queries/questionGroup'
import LoadingCircle from '../atoms/Loading'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import AnswerGroupList from '../questions/AnswerGroupList'

const Answering = ({ match}: any)=> {
    const urlQuestionGroupId = match.params.questionGroupId;
    const connectedWallet = useContext(WalletContext)
    const {loading, questionGroup} = useGetQuestionGroup(subgraphClient, urlQuestionGroupId)

    const sideBarProps = {
        activePage: 'availableQuestions',
        // @ts-ignore
        isWalletConnected: !!connectedWallet.wallet,
        // @ts-ignore
        walletAddress: connectedWallet.address
    }
    return (
        <WisdomNodeTemplate pageProps={sideBarProps}>
            {loading ?
                <LoadingCircle />
                :
                // @ts-ignore
                questionGroup ? connectedWallet.wallet && <AnswerGroupList questionGroup={questionGroup} /> : null
            }
        </WisdomNodeTemplate>
    )
}

export default Answering
