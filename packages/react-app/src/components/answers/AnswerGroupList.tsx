import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import { subgraphClient } from '../../client'
import { useGetAnswerGroupsForAddress } from '../../queries/answerGroup'
import LoadingCircle from '../atoms/Loading'
import AnswerGroupItem from './AnswerGroupItem'

const useStyles = makeStyles(theme => ({
  questionGroupItems: {
    margin: 0,
    padding: '16px 0 16px 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0'
    },
  }
}));

const AnswerGroupList = ({address}: {address: string}) => {
  const classes = useStyles();
  console.log(`get answer group list ${address}`)
    // @ts-ignore
  const {loading, error, answerGroupView} = useGetAnswerGroupsForAddress(subgraphClient, address)
  let content
  if (loading) {
   content = <LoadingCircle />
  } else if (error || answerGroupView == null) {
   content = 'Error loading Answer Group'
  } else if (answerGroupView.answerGroupViews.length)  {
      content = answerGroupView.answerGroupViews.map(ag => <AnswerGroupItem answerGroup={ag} key={ag.id} />)
   } else {
     content = 'No Answered Question Groups' 
   }   
  return (
    <div>
      <Typography variant="h3">My answered question groups:</Typography>
      <div className={classes.questionGroupItems}>
        { content }
      </div>
    </div>
  )
}

export default AnswerGroupList