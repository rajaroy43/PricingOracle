import { generateAnswerSetOptions } from "../question"

describe("Answer set labels description", () => {
    it("Should generate answer set labels", () => {
      const answerSet=[1,2,3]
      //@ts-ignore
      const questionData=generateAnswerSetOptions(answerSet)
      expect(questionData[0]['label']).toBe("Greater Than or Equal to 1 or  Less Than 2")
      expect(questionData[1]['label']).toBe("Greater Than or Equal to 2 or  Less Than 3")
      expect(questionData[2]['label']).toBe("Greater Than or Equal to 3")
    });

    it("Should generate empty answer set labels for empty answer sets", () => {
        const answerSet: number[]=[]
        //@ts-ignore
        const questionData=generateAnswerSetOptions(answerSet)
        expect(questionData).toStrictEqual([])
      });
  });
  
