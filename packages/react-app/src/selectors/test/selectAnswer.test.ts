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
      const expectedCreatedTime= msToLocaleDate(answer.created)
      const expectedSTakeAmount=answer.stakeAmount/10000;

      //@ts-ignore
      const answerView=selectAnswer(answer)

      expect(answerView.answerValue).toBe(answer.question.answerSet[answer.answerIndex])
      expect(answerView.stakeAmountDisplay).toBe(expectedSTakeAmount.toString())
      expect(answerView.createdLocal).toBe(expectedCreatedTime)
    });

    it("Should not get data if answer argument is null ", () => {
      const answer=null
      
      //@ts-ignore
      expect(() => selectAnswer(answer)).toThrow();
    });
    
  });
  
