import React, { useContext } from 'react'
import { Formik, Form } from 'formik'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Button from '../atoms/inputs/buttons/Button'
import Text from '../atoms/inputs/Text'
import Select from '../atoms/inputs/Select'
import DateTime from '../atoms/inputs/DateTime'
import { WalletContext } from '../providers/WalletProvider'
import WisdomSeekerTemplate from '../templates/WisdomSeekerTemplate'
import Address from '../atoms/Address'

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
    }
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

export const BiddableQuestionItem = ({id, question}: {id: string, question: any}) => {
  const classes = useStyles();

  return (
    <div className={classes.question}>
      <div className={classes.desc}>#{question.id} - {question.description} {question.answerSet[1]} on {question.pricingTimeDisplay}</div>
      <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
      <div className={classes.bidRow}>
        <div>
            Top Bid:
            <div>
                {question.currentBid ? question.currentBid + ' LITH' : 'No Bids'}
            </div>
        </div> 
        <div>My Bid:    
            { question.isBiddingOpen === true ? 
                <Formik 
                    initialValues={{
                        assetName: '',
                        pricingTime: ''
                    }}
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500));
                        console.log(JSON.stringify(values, null, 2));
                    }}
                    >
                    <div className={classes.myBidWrapper}>
                        <Form>
                            <Text
                                name="myBid"
                                type="text"
                                style={{width: '80px'}}
                                defaultValue={question.myBid}
                            />
                        </Form>
                        <div className="myBidUnit">LITH</div>
                    </div>
                </Formik>
            :
            <>
                <div style={{"marginRight": "50px"}}>
                    { question.myBid } LITH
                </div>
            </>
            }
        </div>  
      </div>
      { question.myBid ? 
            question.myBid === question.currentBid ? 
                <div className={classes.bidInfo}><InfoOutlinedIcon /> Bidding Tier: First to Know</div>
                :
                question.isBiddingOpen ?
                    <div className={classes.bidInfo}><InfoOutlinedIcon /> Bidding { question.myBid + 100 } LITH will advance your bid to [next tier].</div>
                    :
                    ''
        : '' }
    </div>
  )
}


export const BiddableQuestions = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div> 
            <Typography variant="h3">Biddable Questions</Typography>
            <Typography variant="subtitle1">Questions eligible for bidding</Typography>
            <BidTiers />
            {questions.length ?
                // @ts-ignore
                questions.map((question => <div key={question.id}><BiddableQuestionItem id={question.id} question={question} /><hr className={classes.bidRule} /></div>))
                :
                <div>No Biddable Questions</div>
            }
        </div>
    );
}

export const MyBidQuestionItem = ({id, question}: {id: string, question: any}) => {
    const classes = useStyles();
  
    return (
      <div className={classes.myBidQuestion}>
        { question.answerPending ? 
            <>
                <BiddableQuestionItem id={question.id} question={question} key={question.id} />
            </>
            :
                question.answerAvailable ?
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
                    :
                    <div className={classes.question}>
                        <div className={classes.desc}>#{question.id} - {question.description} {question.answerSet[1]} on {question.pricingTimeDisplay}</div>
                        <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
                        <div className={classes.answerRow}>
                            Question Ended<br />
                            Answer available in [Countdown timer]<br />
                            <span className={classes.outbid}>Highest bid: {question.currentBid} LITH</span>
                            My Bid: {question.myBid} LITH
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

export const MyBidQuestions = ({questions}: {questions: any}) => {
    const classes = useStyles();

    return (
        <div className={classes.myBidQuestionWrapper}> 
            <Typography variant="h3">My Bids</Typography>
            {questions.length ?
                // @ts-ignore
                questions.map((question => <MyBidQuestionItem id={question.id} question={question} key={question.id} />))
                :
                <div>No Current Bids - [Link to Biddable Questions]</div>
            }
        </div>
    );
}

const Design = () => {
    const classes = useStyles();
    /* Added following fields */
    /* Top Bid: question.currentBid */
    /* My Bid: question.myBid */
    const mockData = { questions: [{"__typename":"Question","answerCount":"1","answerSet":["0","60000"],"answerSetTotalStaked":["10000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"BTC equal to or below","endTime":"1634149800","id":"0","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"10000000000000000000","answerSetTotalStakedDisplay":["10000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"10.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 60000", "currentBid": 200, "myBid": "", "answerPending": true, "isBiddingOpen": true},
        {"__typename":"Question","answerCount":"3","answerSet":["0","159750"],"answerSetTotalStaked":["800000000000000000000","300000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"BAYC (ALL) floor price greater than ","endTime":"1635618600","id":"10","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1100000000000000000000","answerSetTotalStakedDisplay":["800000000000000000000","30000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1100.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 159750", "currentBid": 100, "myBid": 100, "isBiddingOpen": true},
        {"__typename":"Question","answerCount":"3","answerSet":["0","7100"],"answerSetTotalStaked":["0","1700000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"Cryptoblot #672 greater than or equal t0","endTime":"1635618600","id":"11","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1700000000000000000000","answerSetTotalStakedDisplay":["0","170000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1700.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 7100", "currentBid": 100, "myBid": 50, "isBiddingOpen": true},
        {"__typename":"Question","answerCount":"1","answerSet":["0","30"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"LINK equal to or below","endTime":"1634149800","id":"2","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 30", "currentBid": "", "myBid": "", "isBiddingOpen": true},
        {"__typename":"Question","answerCount":"1","answerSet":["0","10"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"INJ equal to or below","endTime":"1634149800","id":"3","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 10", "currentBid": "", "myBid": "", "isBiddingOpen": true}]}

    const mockDataMyBid = { questions: [{"__typename":"Question","answerCount":"1","answerSet":["0","60000"],"answerSetTotalStaked":["10000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"BTC equal to or below","endTime":"1634149800","id":"0","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"10000000000000000000","answerSetTotalStakedDisplay":["10000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"10.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 60000", "currentBid": 200, "myBid": 200, "answerPending": true, "bidTier": 1, "isBiddingOpen": true},
        {"__typename":"Question","answerCount":"1","answerSet":["0","30"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"LINK equal to or below","endTime":"1634149800","id":"2","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 30", "currentBid": 200, "myBid": 100, "answerPending": true, "isBiddingOpen": false },
        {"__typename":"Question","answerCount":"1","answerSet":["0","2"],"answerSetTotalStaked":["1000000000000000000","0"],"bounty":"100","category":{"__typename":"QuestionCategory","id":"1","label":"crypto"},"created":"1633975688","description":"XRP equal to or below","endTime":"1634149800","id":"1","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1634236200","startTime":"1633976940","totalStaked":"1000000000000000000","answerSetTotalStakedDisplay":["1000000000000000000","0.0"],"bountyDisplay":"0.0000000000000001","totalStakedDisplay":"1.0","endTimeLocal":"10/13/2021, 1:30:00 PM","isFinished":true,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/14/2021, 1:30:00 PM","topAnswerIndex":0,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 0 or Less Than 2", "currentBid": 300, "myBid": 300, "answerAvailable": true , "isBiddingOpen": false },
        {"__typename":"Question","answerCount":"3","answerSet":["0","159750"],"answerSetTotalStaked":["800000000000000000000","300000000000000000000"],"bounty":"1000000000","category":{"__typename":"QuestionCategory","id":"3","label":"NFT"},"created":"1633977763","description":"BAYC (ALL) floor price greater than ","endTime":"1635618600","id":"10","owner":{"__typename":"User","id":"0xdaa4435abbf8260d3158c174a07c0f928371efc9"},"pricingTime":"1635705000","startTime":"1633977780","totalStaked":"1100000000000000000000","answerSetTotalStakedDisplay":["800000000000000000000","30000000000000000000.0"],"bountyDisplay":"0.000000001","totalStakedDisplay":"1100.0","endTimeLocal":"10/30/2021, 1:30:00 PM","isFinished":false,"createdLocal":"Invalid Date","pricingTimeDisplay":"10/31/2021, 1:30:00 PM","topAnswerIndex":1,"topAnswerValue":"0","topAnswerDisplay":"Greater Than or Equal to 159750", "currentBid": 100, "myBid": 50, "isBiddingOpen": false}]}


    const connectedWallet = useContext(WalletContext)
    const sideBarProps = {
        activePage: 'availableQuestions',
        // @ts-ignore
        isWalletConnected: !!connectedWallet.wallet,
        // @ts-ignore
        walletAddress: connectedWallet.address
    }

    return (
        <WisdomSeekerTemplate pageProps={sideBarProps}>
            <div className={classes.wrapper}>
                <Typography variant="h1">Bidding Flow - Experimental Designs</Typography> 
                <hr className={classes.rule} />
                <BiddableQuestions questions={ mockData.questions } />
                <MyBidQuestions questions={ mockDataMyBid.questions } />
            </div>
        </WisdomSeekerTemplate>
    )
}

export default Design