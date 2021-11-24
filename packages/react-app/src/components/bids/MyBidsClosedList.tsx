import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BiddableQuestionItem from './BiddableQuestionItem';
// DATA NOTE: See MyBidsItemOriginal for original mock logic.

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

const MyBidsClosedList = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.myBidsClosedListWrapper}> 
            <Typography variant="h3">Questions - Bidding Closed</Typography>
            <Typography variant="subtitle1">Questions not eligible for bidding</Typography>

            { questions.length ?
                // @ts-ignore
                questions.map((question => <BiddableQuestionItem id={question.id} question={question} key={question.id} />))
                :
                <div>No Closed Bids - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
            }
        </div>
    );
}

export default MyBidsClosedList