import { BigNumber } from "@ethersproject/abi/node_modules/@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { QuestionGroup } from "lithium-subgraph"
import { formatDate } from "../helpers/formatters"
import { QuestionGroupView } from "../types/questionGroup"
import { selectQuestion } from "./question"

export const selectQuestionGroup = (questionGroup: QuestionGroup): QuestionGroupView => {
  //TODO query a node to get the latest block time
  const now = new Date().getTime() / 1000
  const isFinished = questionGroup.endTime < now
  const totalBounty = questionGroup.questions.reduce((acc, value) => {
    return acc.add(value.bounty)
  }, BigNumber.from(0));
  return {
    ...questionGroup,
    endTimeLocal: formatDate(questionGroup.endTime),
    isFinished,
    questionViews: questionGroup.questions.map(selectQuestion),
    totalBounty: totalBounty.toString(),
    totalBountyDisplay: formatUnits(totalBounty)
  }
}