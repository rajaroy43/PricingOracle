import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Whatshot from '@material-ui/icons/Whatshot'
import { subgraphClient } from '../../client'
import { useGetQuestionBids } from '../../queries/question'
import Address from '../atoms/Address'
import QuestionBidForm from '../forms/QuestionBidForm'
import { BiddableItemProps } from './types.'
import { selectUserBidTier } from '../../selectors/question'

const useStyles = makeStyles(theme => ({
  /* biddable questions form */
  question: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 500,
    lineHeight: '18px',
    maxWidth: '650px'
  },
  address: {
    display: 'inline'
  },
  questionLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  desc: {
    fontSize: '20px',
    marginBottom: '4px'
  },
  bidRow: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    justifyContent: 'space-between',
    marginTop: '16px',
    '& > div': {
      alignItems: 'start',
      display: 'flex',
      flexDirection: 'column',
      fontWeight: 700,
      justifyContent: 'start',
      '& > .topBid': {
        marginTop: '16px !important',
      }
    },
    [theme.breakpoints.up('sm')]: {
      // @ts-ignore
      // Expands the height to accomodate the bid update form on open bids
      height: ({ isBiddingOpen }) => isBiddingOpen === true ? "85px" : "auto"
    }
  },
  updateCol: {
    '& > p': {
      marginTop: '0'
    },
    minWidth: '115px'
  },
  bidInfo: {
    alignItems: 'center',
    display: 'flex',
    flexDiretion: 'row',
    fontWeight: 700,
    marginTop: '16px',
    '& > svg': {
      marginRight: '8px'
    }
  },
  bidRule: {
    margin: '32px 0 32px 0',
    width: '100%'
  },
  hot: {
    fill: '#E96036 !important'
  }
}));

const BiddableQuestionItem = ({ question, connectedWallet }: BiddableItemProps) => {
  var bidInfo
  var topBid
  const isBiddingOpen = question.isBiddingOpen
  const classes = useStyles({ isBiddingOpen })

  const { loading, question: questionAndBids, pricingContractMeta } = useGetQuestionBids(subgraphClient, question.id)
  const myBid = question.userBidView ? question.userBidView.amountDisplay : 'No Bids';

  if (!loading && questionAndBids != null) {
    topBid = questionAndBids.questionBidsView.topBid ? questionAndBids.questionBidsView.topBid.amountDisplay : 'No Bids';
  }

  if (!loading && questionAndBids != null && question.userBidView && pricingContractMeta != null) {
    bidInfo = selectUserBidTier(question.userBidView, questionAndBids, pricingContractMeta.revealTiers)
  }

  return (
    <div className={classes.question}>
      <div className={classes.desc}>#{question.id} - {question.description} equal to or above ${question.answerSet[1]} on {question.pricingTimeDisplay}</div>
      <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
      <div className={classes.bidRow}>
        <div>
          Top Bid<br />
          <br />
          <div>
            {topBid}
          </div>
        </div>
        <div>
          My Bid<br />
          <br />
          <div>
            {myBid} LITH
              </div>
        </div>
        <div className={classes.updateCol} style={{ display: connectedWallet != null && isBiddingOpen ? 'flex' : 'none' }}>
          <>
            <p><strong>Update Bid</strong></p>
            {connectedWallet ?
              <QuestionBidForm
                connectedWallet={connectedWallet}
                question={question}
              />
              :
              <>Connect Wallet to Bid</>
            }
          </>
        </div>
      </div>

      { question.userBidView && topBid ?
        bidInfo && bidInfo.isTopTier ?
          <div className={classes.bidInfo}><InfoOutlinedIcon /> Bidding Tier: First to Know</div>
          :
          bidInfo ?
            <div className={classes.bidInfo}><InfoOutlinedIcon /> Bidding {bidInfo.amountNextTierDisplay} LITH will advance your bid to Tier {bidInfo.nextBidTier}.</div>
            :
            ''
        : ''}

      { true ? <div className={classes.bidInfo}><Whatshot style={{ fill: '#E96036' }} /> High number of bids on this question</div> : ''}

      <hr className={classes.bidRule} />
    </div>
  )
}

export default BiddableQuestionItem