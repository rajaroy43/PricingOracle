import { secToLocaleDate } from "../../helpers/formatters"
import { selectQuestionGroup } from "../questionGroup"

describe("Question Selection ", () => {
    it("Should generate question derived data ", () => {
      const question={
        questions:[{   
            endTime:1633719279,
            answerSet:['0','1'],
            answerSetTotalStaked:[10,200],
            bounty:50,
            totalStaked:210,
            created:1633719279,
            pricingTime:1633719279}]
      }
      const displayTime =secToLocaleDate(question.questions[0].pricingTime)
      //@ts-ignore
      const questionData= selectQuestionGroup(question)
     
      expect(questionData.questionViews[0].bounty).toBe(question.questions[0].bounty)
      expect(questionData.isFinished).toBeFalsy()
      expect(questionData.questionViews[0].pricingTimeDisplay).toBe(displayTime)
      expect(questionData.questionViews[0].endTimeLocal).toBe(displayTime)
      expect(questionData.totalBountyDisplay).toBe('0.00000000000000005')
    });

    it("Should not generate question derived data if empty data provide ", () => {
      const question={ }
      //@ts-ignore
      expect(()=> selectQuestionGroup(question)).toThrow()
    });

    it("Should not generate question if empty data provide ", () => {
      const question=null
      //@ts-ignore
      expect(()=> selectQuestionGroup(question)).toThrow()
    });
  });