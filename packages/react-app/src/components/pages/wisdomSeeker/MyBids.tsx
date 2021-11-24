import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import { WalletContext } from '../../providers/WalletProvider'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'
import MyBidsOpenList from '../../bids/MyBidsOpenList'
import MyBidsClosedList from '../../bids/MyBidsClosedList'

const MyBids = ({ match }: any) => {
    const connectedWallet = useContext(WalletContext)
    const sideBarProps = {
        activePage: 'myBids',
        // @ts-ignore
        isWalletConnected: !!connectedWallet.wallet,
        // @ts-ignore
        walletAddress: connectedWallet.address
    }

    const mockDataMyBidOpen = { questions: [{"__typename":"Question","answerCount":"1","answerSet":["0","60000"],"answerSetTotalStaked":["10000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"BTC equal to or below","endTime":"1634149800","id":"0","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"10000000000000000000","answerSetTotalStakedDisplay":["10000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"10.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 60000", "currentBid": 200, "myBid": 200, "answerPending": true, "bidTier": 1, "isBiddingOpen": true},
                                            {"__typename":"Question","answerCount":"1","answerSet":["0","5000"],"answerSetTotalStaked":["10000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"ETH equal to or below","endTime":"1634149800","id":"1","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"10000000000000000000","answerSetTotalStakedDisplay":["10000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"10.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 60000", "currentBid": 200, "myBid": 200, "answerPending": true, "bidTier": 1, "isBiddingOpen": true}]}
    
    
    const mockDataMyBidClosed = { questions: [{"__typename":"Question","answerCount":"1","answerSet":["0","30"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"LINK equal to or below","endTime":"1634149800","id":"2","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 30", "currentBid": 200, "myBid": 100, "answerPending": true, "isBiddingOpen": false }]}


    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <Typography variant="h1">My Bids</Typography>
            <MyBidsOpenList questions={ mockDataMyBidOpen.questions }/>
            <MyBidsClosedList questions={ mockDataMyBidClosed.questions }/>
        </WisdomSeekerTemplate>
    )
}
export default MyBids