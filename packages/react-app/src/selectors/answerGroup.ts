import { AnswerGroup } from "lithium-subgraph"
import { formatUnits } from "../helpers/formatters"
import { AnswerGroupView } from "../types/answerGroup"
import { selectAnswer } from "./answer"

export const selectAnswerGroup = (answerGroup: AnswerGroup): AnswerGroupView => {
  return {
    ...answerGroup,
    rewardAmountDisplay: formatUnits(answerGroup.rewardAmount),
    answerViews: answerGroup.answers.map(selectAnswer)
  }
}