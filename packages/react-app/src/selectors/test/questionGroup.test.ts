import { secToLocaleDate } from "../../helpers/formatters"
import { selectQuestionGroup } from "../questionGroup"
import { formatUnits } from "@ethersproject/units"
describe("Question Selection ", () => {
    it("Should generate question derived data ", () => {
      const questionGroup={
        questions:[{   
            endTime:1633719279,
            answerSet:['0','1'],
            answerSetTotalStaked:[10,200],
            bounty:50,
            totalStaked:210,
            created:1633719279,
            pricingTime:1633719279}]
      }
      const pricingTimeDisplay =secToLocaleDate(questionGroup.questions[0].pricingTime)
      const endTimeDisplay =secToLocaleDate(questionGroup.questions[0].endTime)
      const expectedTotalBounty = formatUnits(questionGroup.questions[0].bounty)

      //@ts-ignore
      const questionGroupView= selectQuestionGroup(questionGroup)
     
      expect(questionGroupView.questionViews[0].bounty).toBe(questionGroup.questions[0].bounty)
      expect(questionGroupView.isFinished).toBeFalsy()
      expect(questionGroupView.questionViews[0].pricingTimeDisplay).toBe(pricingTimeDisplay)
      expect(questionGroupView.questionViews[0].endTimeLocal).toBe(endTimeDisplay)
      expect(questionGroupView.totalBountyDisplay).toBe(expectedTotalBounty)
    });

    it("Should not generate question derived data if empty data provide ", () => {
      const questionGroup={ }

      //@ts-ignore
      expect(()=> selectQuestionGroup(questionGroup)).toThrow()

    });

    it("Should not generate question if null questionGroup provided ", () => {
      const questionGroup=null

      //@ts-ignore
      expect(()=> selectQuestionGroup(questionGroup)).toThrow()
      
    });

  });