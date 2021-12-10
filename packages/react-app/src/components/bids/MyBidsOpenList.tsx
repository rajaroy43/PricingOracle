import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { subgraphClient } from '../../client'
import { useGetBiddableQuestionsAndUserBid, useGetUserBids } from '../../queries/question'
import { ConnectedWalletProps } from '../../types/user'
import BiddableQuestionItem from './BiddableQuestionItem'
import LoadingCircle from '../atoms/Loading'

const useStyles = makeStyles(theme => ({
    /* my bids open list */
    myBidsOpenListWrapper: {
        marginTop: '16px',
        '& > h3': {
            fontWeight: '700',
            marginBottom: '0'
        }
    }
}));

const MyBidsOpenList = ({connectedWallet}: {connectedWallet: ConnectedWalletProps}) => {
    const classes = useStyles();
    const {loading, bids} = useGetUserBids(subgraphClient, connectedWallet.address)

    return (
        <div className={classes.myBidsOpenListWrapper}> 
            <Typography variant="h3">Questions - Bidding Open</Typography>
            <Typography variant="subtitle1">Questions eligible for bidding</Typography>

            { !loading ?
                bids.biddingOpenQuestions.length ?
                  bids.biddingOpenQuestions.map((question => <BiddableQuestionItem 
                    key={question.id} 
                    question={question}  
                    connectedWallet={connectedWallet}
                  />))
                  :
                  <div>No Current Bids - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
                :
                <LoadingCircle />    
            }
        </div>
    );
}

export default MyBidsOpenList