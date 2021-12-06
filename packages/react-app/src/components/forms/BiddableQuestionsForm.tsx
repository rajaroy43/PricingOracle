import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BiddableQuestionItem from '../bids/BiddableQuestionItem'

const useStyles = makeStyles(theme => ({
    /* page wide */
    wrapper: {
        margin: '32px'
    },
    rule: {
        marginBottom: '64px',
        marginTop: '64px'
    },
    /* bid tiers */
    bidTiers: {
        display: 'flex',
        flexDirection: 'row',
        margin: '16px 0 24px 0',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            marginTop: '8px'
        }
    },
    bidTierHeading: {
        marginBottom: 0
    },
    bidTierItem: {
        alignItems: 'center',
        border: '1px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '8px 0',
        padding: '16px',
        '& > h3': {
            fontSize: '20First To Knowpx',
            margin: 0
        },
        '& > h4': {
            fontSize: '24px',
            margin: '32px 0',
        },
        '& > p': {
            margin: 0,
            textAlign: 'center'
        }
    },
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
        display: 'flex',
        flexDirection: 'row',
        fontSize: '18px',
        justifyContent: 'space-between',
        marginTop: '16px',
        maxWidth: '400px',
        '& > div': {
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 700,
            justifyContent: 'start',
            '& > .topBid': {
                marginTop: '16px !important',
            }
        }
    },
    myBidWrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        whiteSpace: 'nowrap',
        '& > .myBidUnit': {
            marginLeft: '4px'
        }
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
}));

export const BidTiers = () => {
    const classes = useStyles();

    return (
        <>
            <h3 className={classes.bidTierHeading}>Bidding Tiers</h3>
            <div className={classes.bidTiers}>
                <div className={classes.bidTierItem}>
                    <h3>First to Know</h3>
                    <br />
                    <p>Asset price revealed immediately when available</p>
                </div>

                <div className={classes.bidTierItem}>
                    <h3>Second to Know</h3>
                    <p>Asset price revealed one hour after it is available</p>
                </div>

                <div className={classes.bidTierItem}>
                    <h3>Third to Know</h3>
                    <p>Asset price revealed two hours after it is available</p>
                </div>
            </div>
        </>
    )
}

const BiddableQuestionsForm = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div> 
            <Typography variant="h1">Biddable Questions</Typography>
            <Typography variant="subtitle1">Questions eligible for bidding</Typography>
            <BidTiers />
            { questions.length ?
                // @ts-ignore
                questions.map((question => <div key={question.id}><BiddableQuestionItem id={question.id} question={question} /><hr className={classes.bidRule} /></div>))
                :
                <div>No Biddable Questions</div>
            }
        </div>
    );
}

export default BiddableQuestionsForm