import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '../atoms/inputs/buttons/Button'
import Address from '../atoms/Address'

const useStyles = makeStyles(theme => ({
    /* my answer questions */
    myAnswerQuestion: {
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
    desc: {
        fontSize: '20px',
        marginBottom: '4px'
    },
    bidRule: {
        margin: '32px 0 32px 0',
        width: '100%'
    },
}));

const MyAnswersNowItem = ({id, question}: {id: string, question: any}) => {
    const classes = useStyles();
  
    return (
      <div className={classes.myAnswerQuestion}>
        <div className={classes.question}>
            <div className={classes.desc}>#{question.id} - {question.description} {question.answerSet[1]} on {question.pricingTimeDisplay}</div>
            <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
            <div className={classes.answerRow}>
                Question Ended<br />
                Answer Available Now<br />
                <Button
                    label="Decrypt Answer"
                    type="submit"
                />
            </div>
        </div>

        <hr className={classes.bidRule} />
      </div>
    )
}

export default MyAnswersNowItem