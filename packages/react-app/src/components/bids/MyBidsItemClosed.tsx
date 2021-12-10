import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '../atoms/inputs/buttons/Button'
import Address from '../atoms/Address'
import BiddableQuestionItem from './BiddableQuestionItem'
import { ConnectedWalletProps } from '../../types/user'
import { BiddableItemProps } from './types.'

const useStyles = makeStyles(theme => ({
    /* my bid questions */
    myBidQuestionWrapper: {
        paddingTop: '64px',
        '& > h3': {
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

const MyBidQuestionItem = ({question, connectedWallet}: BiddableItemProps) => {
    const classes = useStyles();
  
    return (
      <div className={classes.myBidQuestion}>
        { question.isBiddingOpen ? 
            <>
                <BiddableQuestionItem question={question} connectedWallet={connectedWallet} />
            </>
            :
                question.isAnswerCalculated ?
                    <div className={classes.question}>
                        <div className={classes.desc}>#{question.id} - {question.description} {question.answerSetDisplay[1]} on {question.pricingTimeDisplay}</div>
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
                    :
                    <div className={classes.question}>
                        <div className={classes.desc}>#{question.id} - {question.description} {question.answerSetDisplay[1]} on {question.pricingTimeDisplay}</div>
                        <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
                        <div className={classes.answerRow}>
                            Question Ended<br />
                            Answer available in [Countdown timer]<br />
                            <span className={classes.outbid}>Highest bid: - LITH</span>
                            My Bid: - LITH
                            <Button
                                label="Re-Claim My Bid"
                                type="submit"
                            />
                        </div>
                    </div>
        }
        <hr className={classes.bidRule} />
      </div>
    )
}

export default MyBidQuestionItem