import { QuestionGroup } from "lithium-subgraph"
import { formatDate } from "../helpers/formatters"
import { QuestionGroupView } from "../types/questionGroup"
import { selectQuestion } from "./question"

export const selectQuestionGroup = (questionGroup: QuestionGroup): QuestionGroupView => {
  //TODO query a node to get the latest block time
  const now = new Date().getTime() / 1000
  const isFinished = questionGroup.endTime < now
  return {
    ...questionGroup,
    endTimeLocal: formatDate(questionGroup.endTime),
    isFinished,
    questionViews: questionGroup.questions.map(selectQuestion)
  }
}