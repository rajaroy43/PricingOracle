import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import Typography from "@material-ui/core/Typography"
import { subgraphClient } from '../../client'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import { useGetUpcomingQuestionGroups } from '../../queries/questionGroup'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import QuestionGroupList from '../questions/QuestionGroupList'

const UpcomingQuestions = () => {
  const {wallet} = useContext(WalletContext)
  const {loading, questionGroups} = useGetUpcomingQuestionGroups(subgraphClient)
  const sideBarProps = {
    activePage: 'availableQuestions',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
  }

  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <Typography variant="h1">Upcoming Questions</Typography>
     
      <Grid container>
        <Grid item md={12} sm={12} xs={12}>
          {loading  ?
            <LoadingCircle />
            :
            questionGroups != null ?
              <QuestionGroupList questionGroups={questionGroups} />
              :
              'Error Loading Question Groups'
          }
        </Grid>
      </Grid>
    </WisdomNodeTemplate>
  )
  return  main;
}

export default UpcomingQuestions