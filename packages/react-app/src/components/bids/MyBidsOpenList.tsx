import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BiddableQuestionItem from './BiddableQuestionItem';
// DATA NOTE: See MyBidsItemOriginal for original mock logic.

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

const MyBidsOpenList = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.myBidsOpenListWrapper}> 
            <Typography variant="h3">Questions - Bidding Open</Typography>
            <Typography variant="subtitle1">Questions eligible for bidding</Typography>

            {questions.length ?
                // @ts-ignore
                questions.map((question => <BiddableQuestionItem id={question.id} question={question} key={question.id} />))
                :
                <div>No Current Bids - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
            }
        </div>
    );
}

export default MyBidsOpenList