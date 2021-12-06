import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MyAnswersNowItem from './MyAnswersNowItem';

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

const MyAnswersNowList = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.myAnswerQuestionWrapper}> 
            <Typography variant="h3">Answers - Available Now</Typography>
            <Typography variant="subtitle1">Answers available now for viewing</Typography>

            {questions.length ?
                // @ts-ignore
                questions.map((question => <MyAnswersNowItem id={question.id} question={question} key={question.id} />))
                :
                <div>No Answers Available - <RouterLink to="biddable-questions">View Biddable Questions</RouterLink></div>
            }
        </div>
    );
}

export default MyAnswersNowList