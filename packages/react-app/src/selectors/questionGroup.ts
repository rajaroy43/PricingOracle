import { BigNumber } from "@ethersproject/abi/node_modules/@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { QuestionGroup } from "lithium-subgraph"
import { msToSec, secToLocaleDate, secToMs } from "../helpers/formatters"
import { QuestionGroupView } from "../types/questionGroup"
import { selectQuestion } from "./question"

export const selectQuestionGroup = (questionGroup: QuestionGroup): QuestionGroupView => {
  //TODO query a node to get the latest block time
  const now = msToSec(new Date().getTime())
  const isFinished = questionGroup.endTime < now
  //@ts-ignore
  const totalBounty = questionGroup.questions.reduce((acc, value) => {
    return acc.add(value.bounty)
  }, BigNumber.from(0));
  const endTimeLocal = secToLocaleDate(questionGroup.endTime)
  const startTimeLocal = secToLocaleDate(questionGroup.startTime)
  return {
    ...questionGroup,
    endTimeLocal,
    startTimeLocal,
    isFinished,
    //@ts-ignore
    questionViews: questionGroup.questions.map(selectQuestion),
    totalBounty: totalBounty.toString(),
    totalBountyDisplay: formatUnits(totalBounty)
  }
}