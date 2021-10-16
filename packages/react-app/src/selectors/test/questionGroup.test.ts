import { secToLocaleDate } from "../../helpers/formatters"
import { selectQuestionGroup } from "../questionGroup"
import { formatUnits } from "@ethersproject/units"
import { CategoryLabelDisplay } from "../../types/question"
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
            startTime:1633999779,
            pricingTime:1633719279,
            category:{
              id:1
            }
          }],
          endTime:1633719279,
          startTime:1633999779
      }
      const pricingTimeDisplay =secToLocaleDate(questionGroup.questions[0].pricingTime)
      const endTimeDisplay =secToLocaleDate(questionGroup.endTime)
      const startTimeLocalDisplay=secToLocaleDate(questionGroup.questions[0].startTime)
      const expectedTotalBountyDisplay = formatUnits(questionGroup.questions[0].bounty)
      const totalStake = questionGroup.questions[0].totalStaked
      const totalStakeDisplay=formatUnits(totalStake)
      const totalPool=totalStake+questionGroup.questions[0].bounty
      const totalPoolDisplay=formatUnits(totalPool)
      const categoryLabelDisplay=CategoryLabelDisplay[questionGroup.questions[0].category.id]
      
      //@ts-ignore
      const questionGroupView= selectQuestionGroup(questionGroup)
      
      expect(questionGroupView.endTimeLocal).toBe(endTimeDisplay)
      expect(questionGroupView.startTimeLocal).toBe(startTimeLocalDisplay)
      expect(questionGroupView.isFinished).toBeTruthy()
      expect(questionGroupView.questionViews[0].bounty).toBe(questionGroup.questions[0].bounty)
      expect(questionGroupView.questionViews[0].pricingTimeDisplay).toBe(pricingTimeDisplay)
      expect(questionGroupView.totalBountyDisplay).toBe( expectedTotalBountyDisplay)
      expect(questionGroupView.totalStake).toBe(totalStake.toString())
      expect(questionGroupView.totalStakeDisplay).toBe(totalStakeDisplay)
      expect(questionGroupView.totalPool).toBe(totalPool.toString())
      expect(questionGroupView.totalPoolDisplay).toBe(totalPoolDisplay)
      expect(questionGroupView.categoryLabel).toBe(categoryLabelDisplay)
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