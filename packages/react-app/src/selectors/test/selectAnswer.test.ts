import { selectAnswer } from "../answer"

  describe("Selector for selecting answer", () => {
    it("Should get stakeAmount and local time show ", () => {
      const answer={
        question: {answerSet:  ['0', '1']},
        answerIndex: 0,
        stakeAmount: 10,
        created: 1633697838,
      }
      //@ts-ignore
      const questionData=selectAnswer(answer)
      expect(questionData.answerValue).toBe(answer.question.answerSet[answer.answerIndex])
      expect(questionData.stakeAmountDisplay).toBe("0.001")
      expect(questionData.createdLocal).toBe("1/20/1970, 03:18:17")
    });

  });
  
