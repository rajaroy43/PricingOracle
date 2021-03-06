import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { subgraphClient } from '../../client'
import { useGetClosedQuestionsAndUserBid, useGetUserBids } from '../../queries/question'
import { ConnectedWalletProps } from '../../types/user'
import BiddableQuestionItem from './BiddableQuestionItem'
import LoadingCircle from '../atoms/Loading'

const useStyles = makeStyles(theme => ({
    /* my bids closed list */
    myBidsClosedListWrapper: {
        marginTop: '16px',
        '& > h3': {
            fontWeight: '700',
            marginBottom: '0'
        }
    }
}));

const MyBidsClosedList = ({connectedWallet}: {connectedWallet: ConnectedWalletProps}) => {
    const classes = useStyles();
    const {loading, bids} = useGetUserBids(subgraphClient, connectedWallet.address)

    return (
        <div className={classes.myBidsClosedListWrapper}> 
            <Typography variant="h3">Questions - Bidding Closed</Typography>
            <Typography variant="subtitle1">Questions not eligible for bidding</Typography>

            { !loading ? 
                bids.answeringOpenQuestions.length ?
                  bids.answeringOpenQuestions.map((question =><BiddableQuestionItem 
                    key={question.id} 
                    question={question}  
                    connectedWallet={connectedWallet}
                  />))
                  :
                  <div>No Closed Bids - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
                :
                <LoadingCircle />
            }
        </div>
    );
}

export default MyBidsClosedList