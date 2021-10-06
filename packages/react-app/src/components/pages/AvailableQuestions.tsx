import React, { useContext } from 'react'
import Typography from "@material-ui/core/Typography"
import { subgraphClient } from '../../client'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import { useGetActiveQuestionGroups } from '../../queries/questionGroup'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import UserStats from '../users/UserStats'
import UserEarnings from '../users/UserEarnings'
import QuestionGroupList from '../questions/QuestionGroupList'
import { Grid } from '@material-ui/core'

const AvailableQuestions = () => {
  const connectedWallet = useContext(WalletContext)
  const {loading, questionGroups} = useGetActiveQuestionGroups(subgraphClient)
  const sideBarProps = {
    activePage: 'availableQuestions',
    // @ts-ignore
    isWalletConnected: !!connectedWallet.wallet,
    // @ts-ignore
    walletAddress: connectedWallet.address
  }

  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <Typography variant="h1">Available Questions</Typography>
     
      <Grid container>
        <Grid item md={7} sm={7} xs={12}>
          <UserStats />
        </Grid>
        <Grid item md={5} sm={5} xs={12}>
          <UserEarnings />
        </Grid>
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

export default AvailableQuestions