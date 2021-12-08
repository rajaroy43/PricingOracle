import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import { WalletContext } from '../../providers/WalletProvider'
import { subgraphClient } from '../../../client'
import { useGetBiddableQuestionsAndUserBid } from '../../../queries/question'
import WisdomSeekerTemplate from '../../templates/WisdomSeekerTemplate'
import LoadingCircle from '../../atoms/Loading'
import BiddableQuestionItem from '../../bids/BiddableQuestionItem'

const useStyles = makeStyles(theme => ({
  /* bid tiers */
  bidTiers: {
      display: 'flex',
      flexDirection: 'row',
      margin: '16px 0 24px 0',
      [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
          marginTop: '8px'
      }
  },
  bidTierHeading: {
      marginBottom: 0
  },
  bidTierItem: {
      alignItems: 'center',
      border: '1px solid #fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      margin: '8px 0',
      padding: '16px',
      '& > h3': {
          fontSize: '20px',
          margin: 0
      },
      '& > h4': {
          fontSize: '24px',
          margin: '32px 0',
      },
      '& > p': {
          margin: 0,
          textAlign: 'center'
      }
  }
}));

export const BidTiers = () => {
  const classes = useStyles();

  return (
      <>
          <h3 className={classes.bidTierHeading}>Bidding Tiers</h3>
          <div className={classes.bidTiers}>
              <div className={classes.bidTierItem}>
                  <h3>First to Know</h3>
                  <br />
                  <p>Asset price revealed immediately when available</p>
              </div>

              <div className={classes.bidTierItem}>
                  <h3>Second to Know</h3>
                  <p>Asset price revealed one hour after it is available</p>
              </div>

              <div className={classes.bidTierItem}>
                  <h3>Third to Know</h3>
                  <p>Asset price revealed two hours after it is available</p>
              </div>
          </div>
      </>
  )
}

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
          <BidTiers />
          {loading  ?
            <LoadingCircle />
            :
            questions != null ?
              questions.map((question:any) => <BiddableQuestionItem 
                                                key={question.id} 
                                                question={question}  
                                                connectedWallet={wallet}
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