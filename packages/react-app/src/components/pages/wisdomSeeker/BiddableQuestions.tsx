import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { subgraphClient } from '../../../client'
import LoadingCircle from '../../atoms/Loading'
import { WalletContext } from '../../providers/WalletProvider'
import { useGetBiddableQuestionsAndUserBid } from '../../../queries/question'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'

const BiddableQuestions = () => {
  const {wallet} = useContext(WalletContext)
  const {loading, questions} = useGetBiddableQuestionsAndUserBid(subgraphClient, wallet.address || "0x0")
  const sideBarProps = {
    activePage: 'biddableQuestions',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
  }

  const main = (
    <WisdomSeekerTemplate pageProps={sideBarProps}>
      <Typography variant="h1">Active Questions</Typography>
     
      <Grid container>
        <Grid item md={12} sm={12} xs={12}>
          {loading  ?
            <LoadingCircle />
            :
            questions != null ?
              questions.map((question:any) => <div>Question # {question.id} Totals Bids {question.bidCount} </div>)
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