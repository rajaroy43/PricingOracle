import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MyBidQuestionItem from '../bids/MyBidsQuestionItem';


const useStyles = makeStyles(theme => ({
    /* my bid questions */
    myBidQuestionWrapper: {
        '& > h1': {
            marginBottom: '32px'
        }
    },
    myBidQuestion: {
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 500,
        lineHeight: '18px',
        maxWidth: '650px'
    },
    answerRow: {
        alignItems: 'start',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '20px',
        fontWeight: 700,
        justifyContent: 'start',
        lineHeight: 1.25,
        marginTop: '16px',
        '& > .MuiButtonBase-root': {
            marginTop: '8px'
        }
    },
    outbid: {
        fontSize: '16px',
        fontWeight: 500,
        marginBottom: '16px'
    }
}));

const MyBidQuestionsForm = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.myBidQuestionWrapper}> 
            <Typography variant="h1">My Bids</Typography>
            {questions.length ?
                // @ts-ignore
                questions.map((question => <MyBidQuestionItem id={question.id} question={question} key={question.id} />))
                :
                <div>No Current Bids - [Link to Biddable Questions]</div>
            }
        </div>
    );
}

export default MyBidQuestionsForm