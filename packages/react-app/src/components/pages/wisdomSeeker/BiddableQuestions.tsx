import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { WalletContext } from '../../providers/WalletProvider'
import { subgraphClient } from '../../../client'
import { useGetBiddableQuestionsAndUserBid } from '../../../queries/question'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'
import LoadingCircle from '../../atoms/Loading'
import BiddableQuestionItem from '../../bids/BiddableQuestionItem'

const BiddableQuestions = () => {
  const {wallet} = useContext(WalletContext)
  const {loading, questions} = useGetBiddableQuestionsAndUserBid(subgraphClient, wallet.address || "0x0")
  const sideBarProps = {
    activePage: 'biddableQuestions',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
  }

  console.log('openQuestions', questions);

  const main = (
    <WisdomSeekerTemplate pageProps={sideBarProps}>
      <Typography variant="h1">Active Questions</Typography>
     
      <Grid container>
        <Grid item md={12} sm={12} xs={12}>
          {loading  ?
            <LoadingCircle />
            :
            questions != null ?
              questions.map((question:any) => <BiddableQuestionItem 
                                                key={question.id} 
                                                question={question}  
                                                connectedWallet={wallet}
                                                showBidForm={true}
                                              />)
              :
              'Error Loading Question Groups'
          }
        </Grid>
      </Grid>
    </WisdomSeekerTemplate>
  )
  return  main;
}

export default BiddableQuestions