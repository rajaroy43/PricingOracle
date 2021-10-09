import { msToLocaleDate } from "../../helpers/formatters"
import { selectAnswer } from "../answer"

  describe("Answer Slection", () => {
    it("Should get stakeAmount and local time show ", () => {
      const answer={
        question: {answerSet:  ['0', '1']},
        answerIndex: 0,
        stakeAmount: 10,
        created: 1633697838,
      }
      const createdTime= msToLocaleDate(answer.created)
      //@ts-ignore
      const questionData=selectAnswer(answer)
      expect(questionData.answerValue).toBe(answer.question.answerSet[answer.answerIndex])
      expect(questionData.stakeAmountDisplay).toBe("0.001")
      expect(questionData.createdLocal).toBe(createdTime)
    });

    it("Should not get data if answer argument is null ", () => {
      const answer=null
      //@ts-ignore
      expect(() => selectAnswer(answer)).toThrow();
    });
    
  });
  
