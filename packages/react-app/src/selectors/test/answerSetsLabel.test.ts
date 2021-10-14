import { generateAnswerSetOptions } from "../question"

describe("Answer set labels description", () => {
    it("Should generate answer set labels", () => {
      const answerSet=['1','2','3']
      const answerSetLabels=generateAnswerSetOptions(answerSet)
      expect(answerSetLabels[0]['label']).toBe(`Greater Than or Equal to ${answerSet[0]} or  Less Than ${answerSet[1]}`)
      expect(answerSetLabels[1]['label']).toBe(`Greater Than or Equal to ${answerSet[1]} or  Less Than ${answerSet[2]}`)
      expect(answerSetLabels[2]['label']).toBe(`Greater Than or Equal to ${answerSet[2]}`)
    });

    it("Should generate empty answer set labels for empty answer sets", () => {
        const answerSet: string[]=[]
        const expectedAnswerSetLabels: any[]=[]
        const answerSetLabels=generateAnswerSetOptions(answerSet)
        expect(answerSetLabels).toStrictEqual(expectedAnswerSetLabels)
      });
  });
  
