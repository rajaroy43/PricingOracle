import { Answer } from "lithium-subgraph"
import { formatUnits, msToLocaleDate } from "../helpers/formatters"
import { AnswerView } from "../types/answer"

export const selectAnswer = (answer: Answer): AnswerView => {
  // @ts-ignore
  const answerValue = answer != null ? answer.question.answerSet[answer.answerIndex] : 0
  return {
    ...answer,
    answerValue,
    stakeAmountDisplay: formatUnits(answer.stakeAmount),
    createdLocal: msToLocaleDate(answer.created)
  }
}