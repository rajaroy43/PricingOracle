import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { subgraphClient } from '../../client'
import { useGetBiddableQuestionsAndUserBid, useGetUserBids } from '../../queries/question'
import { ConnectedWalletProps } from '../../types/user'
import MyAnswersNowItem from './MyAnswersNowItem'
import LoadingCircle from '../atoms/Loading'

const useStyles = makeStyles(theme => ({
    /* my answers */
    myAnswerQuestionWrapper: {
        marginTop: '16px',
        '& > h3': {
            fontWeight: '700',
            marginBottom: '0'
        }
    }
}));

const MyAnswersNowList = ({connectedWallet}: {connectedWallet: ConnectedWalletProps}) => {
    const classes = useStyles()
    const {loading, bids} = useGetUserBids(subgraphClient, connectedWallet.address)


    return (
        <div className={classes.myAnswerQuestionWrapper}> 
            <Typography variant="h3">Answers - Available Now</Typography>
            <Typography variant="subtitle1">Answers available now for viewing</Typography>

            { !loading ?
                bids.answeredQuestions.length?
                  bids.answeredQuestions.map((question => <MyAnswersNowItem 
                    key={question.id}
                    question={question}
                    connectedWallet={connectedWallet} 
                  />))
                  :
                  <div>No Answers Available - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
                :
                <LoadingCircle />
            }
        </div>
    );
}

export default MyAnswersNowList