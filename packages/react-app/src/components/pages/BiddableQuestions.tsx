import React, { useContext } from 'react'
import { WalletContext } from '../providers/WalletProvider'
import WisdomSeekerTemplate from '../templates/WisdomSeekerTemplate'
import BiddableQuestionsForm from '../forms/BiddableQuestionsForm'

const BiddableQuestions = ({ match }: any) => {
    const connectedWallet = useContext(WalletContext)
    const sideBarProps = {
        activePage: 'biddableQuestions',
        // @ts-ignore
        isWalletConnected: !!connectedWallet.wallet,
        // @ts-ignore
        walletAddress: connectedWallet.address
    }

    /* Added following fields */
    /* Top Bid: question.currentBid */
    /* My Bid: question.myBid */
    const mockData = { questions: [{"__typename":"Question","answerCount":"1","answerSet":["0","60000"],"answerSetTotalStaked":["10000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"BTC equal to or below","endTime":"1634149800","id":"0","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"10000000000000000000","answerSetTotalStakedDisplay":["10000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"10.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 60000", "currentBid": 200, "myBid": "", "answerPending": true, "biddingIsOpen": true, "hot": true},
        {"__typename":"Question","answerCount":"3","answerSet":["0","159750"],"answerSetTotalStaked":["800000000000000000000","300000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"BAYC (ALL) floor price greater than ","endTime":"1635618600","id":"10","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1100000000000000000000","answerSetTotalStakedDisplay":["800000000000000000000","30000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1100.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 159750", "currentBid": 100, "myBid": 100, "biddingIsOpen": true},
        {"__typename":"Question","answerCount":"3","answerSet":["0","7100"],"answerSetTotalStaked":["0","1700000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"Cryptoblot #672 greater than or equal t0","endTime":"1635618600","id":"11","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1700000000000000000000","answerSetTotalStakedDisplay":["0","170000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1700.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 7100", "currentBid": 100, "myBid": 50, "biddingIsOpen": true},
        {"__typename":"Question","answerCount":"1","answerSet":["0","30"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"LINK equal to or below","endTime":"1634149800","id":"2","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 30", "currentBid": "", "myBid": "", "biddingIsOpen": true},
        {"__typename":"Question","answerCount":"1","answerSet":["0","10"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"INJ equal to or below","endTime":"1634149800","id":"3","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 10", "currentBid": "", "myBid": "", "biddingIsOpen": true}]}


    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <BiddableQuestionsForm questions={ mockData.questions }/>
        </WisdomSeekerTemplate>
    )
}
export default BiddableQuestions