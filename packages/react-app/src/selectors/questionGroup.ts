import { BigNumber } from "@ethersproject/abi/node_modules/@ethersproject/bignumber"
import { QuestionGroup } from "lithium-subgraph"
import { formatUnits, msToSec, secToLocaleDate } from "../helpers/formatters"
import { CategoryLabelDisplay } from "../types/question"
import { QuestionGroupView } from "../types/questionGroup"
import { selectQuestion } from "./question"

export const selectQuestionGroup = (questionGroup: QuestionGroup): QuestionGroupView => {
  //TODO query a node to get the latest block time
  const now = msToSec(new Date().getTime())
  const isFinished = questionGroup.endTime < now
  const isStarted = questionGroup.startTime < now
  //@ts-ignore
  const totalBounty = questionGroup.questions.reduce((acc, value) => {
    return acc.add(value.bounty)
  }, BigNumber.from(0));
  const endTimeLocal = secToLocaleDate(questionGroup.endTime)
  const startTimeLocal = secToLocaleDate(questionGroup.startTime)
  //@ts-ignore
  const totalStake = questionGroup.questions.reduce((acc, question) => {
    return acc.add(question.totalStaked)
  }, BigNumber.from(0))
  const totalPool = totalStake.add(totalBounty)
  //@ts-ignore
  const categoryId = questionGroup.questions[0].category.id
  return {
    ...questionGroup,
    endTimeLocal,
    startTimeLocal,
    isFinished,
    isStarted,
    //@ts-ignore
    questionViews: questionGroup.questions.map(selectQuestion),
    totalBounty: totalBounty.toString(),
    totalBountyDisplay: formatUnits(totalBounty.toString()),
    totalStake: totalStake.toString(),
    totalStakeDisplay: formatUnits(totalStake.toString()),
    totalPool: totalPool.toString(),
    totalPoolDisplay: formatUnits(totalPool.toString()),
    categoryId,
    categoryLabel: CategoryLabelDisplay[parseInt(categoryId, 10)]
  }
}