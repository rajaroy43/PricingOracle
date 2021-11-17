import { makeStyles } from '@material-ui/core/styles'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Whatshot from '@material-ui/icons/Whatshot'
import { Form, Formik } from 'formik'
import React from 'react'
import Address from '../atoms/Address'
import Text from '../atoms/inputs/Text'

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
    hot: {
        fill: '#E96036 !important'
    }
}));

const BiddableQuestionItem = ({id, question}: {id: string, question: any}) => {
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
              { question.biddingIsOpen === true ? 
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
                  question.biddingIsOpen ?
                      <div className={classes.bidInfo}><InfoOutlinedIcon /> Bidding { question.myBid + 100 } LITH will advance your bid to [next tier].</div>
                      :
                      ''
          : '' }

          { question.hot ? <div className={classes.bidInfo}><Whatshot style={{fill: '#E96036'}} /> High number of bids on this question</div> : '' }
      </div>
    )
}

export default BiddableQuestionItem