import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Whatshot from '@material-ui/icons/Whatshot'
import { Form, Formik } from 'formik'
import Address from '../atoms/Address'
import Text from '../atoms/inputs/Text'
import Button from '../atoms/inputs/buttons/Button'

const useStyles = makeStyles(theme => ({
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
        alignItems: 'start',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '18px',
        justifyContent: 'space-between',
        marginTop: '16px',
        '& > div': {
            alignItems: 'start',
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 700,
            justifyContent: 'start',
            '& > .topBid': {
                marginTop: '16px !important',
            }
        },
        [theme.breakpoints.up('sm')]: {
            // @ts-ignore
            // Expands the height to accomodate the bid update form on open bids
            height: ({ isBiddingOpen }) => isBiddingOpen === true ? "85px" : "auto"
        }
    },
    updateCol: {
        '& > p': {
            marginTop: '0'
        },
        minWidth: '115px'
    },
    myBidWrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        whiteSpace: 'nowrap'
    },
    bidUnit: {
        marginLeft: '4px'
    },
    buttonUpdateBid: {
        marginTop: '16px'
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
    hot: {
        fill: '#E96036 !important'
    }
}));

const BiddableQuestionItem = ({id, question}: {id: string, question: any}) => {
    const isBiddingOpen = question.isBiddingOpen;
    const classes = useStyles({ isBiddingOpen });

    const calcTopBid = ({bids} : {bids:any}) => {
        if (bids && bids.length > 0) {
            return Math.max(...bids);
        } else {
            return 'No Bids';
        }
    }
  
    return (
      <div className={classes.question}>
        <div className={classes.desc}>#{question.id} - {question.description} equal to or above ${question.answerSet[1]} on {question.pricingTimeDisplay}</div>
        <div>Asked by <Address address={question.owner.id} length={4} className={classes.address} /></div>
        <div className={classes.bidRow}>
          <div>
              Top Bid<br />
              <br />
              <div>
                  {calcTopBid(question.bids)}
              </div>
          </div> 
          <div>
              My Bid<br />
              <br />
              <div>
                {question.myBid} LITH 
              </div>
          </div>
          <div className={classes.updateCol}>   
              { question.isBiddingOpen === true ? 
                <>
                  <p><strong>Update Bid</strong></p>
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
                    <Form>
                      <div className={classes.myBidWrapper}>
                        <Text
                            name="myBid"
                            type="text"
                            style={{width: '80px'}}
                            defaultValue=""
                        /><span className={classes.bidUnit}>LITH</span>
                      </div>
                      <Button label="Update Bid"
                        className={classes.buttonUpdateBid} />
                    </Form>
                  </Formik>
                  </>
              :
              null
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

          { question.hot ? <div className={classes.bidInfo}><Whatshot style={{fill: '#E96036'}} /> High number of bids on this question</div> : '' }
         
          <hr className={classes.bidRule} />
      </div>
    )
}

export default BiddableQuestionItem