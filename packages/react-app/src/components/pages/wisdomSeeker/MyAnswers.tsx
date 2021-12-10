import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { WalletContext } from '../../providers/WalletProvider'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'
import MyAnswersNowList from '../../bids/MyAnswersNowList'
import MyAnswersSoonList from '../../bids/MyAnswersSoonList'

const MyAnswers = ({ match }: any) => {
    const {wallet} = useContext(WalletContext)

    const sideBarProps = {
        activePage: 'myAnswers',
        isWalletConnected: !!wallet,
        walletAddress: wallet ? wallet.address : undefined
    }

    /*
    const mockDataMyAnswersNow = { questions: [
        {"__typename":"Question","answerCount":"1","answerSet":["0","2"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"XRP equal to or below","endTime":"1634149800","id":"1","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 2", "currentBid": 300, "myBid": 300, "answerAvailable": true , "isBiddingOpen": false }]}

    const mockDataMyAnswersSoon = { questions: [
        {"__typename":"Question","answerCount":"3","answerSet":["0","159750"],"answerSetTotalStaked":["800000000000000000000","300000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"BAYC (ALL) floor price greater than ","endTime":"1635618600","id":"10","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1100000000000000000000","answerSetTotalStakedDisplay":["800000000000000000000","30000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1100.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 159750", "currentBid": 100, "myBid": 50, "isBiddingOpen": false}]}
    */

    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <Typography variant="h1">My Answers</Typography>

            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                  {wallet ?
                    <MyAnswersNowList connectedWallet={wallet} />
                  
                    :
                    <div>Connect your wallet to view your answers</div>
                  }
                  {/*<MyAnswersSoonList connectedWallet={wallet} />*/}
                </Grid>
            </Grid>
        </WisdomSeekerTemplate>
    )
}
export default MyAnswers