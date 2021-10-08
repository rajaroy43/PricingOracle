import { selectAnswerGroups} from "../answerGroup"

  describe("Selecting answer Groups", () => {
    it("Should get unclaimedRewards and answergroups ", () => {
      const answerGroup=[{
        isRewardCalculated:"NotCalculated",
        rewardAmount:100,
        answers:[{
            question:{answerSet:['0', '1']},
            answerIndex: 0,
            stakeAmount: 10,
            created: 1633697838,
        }]
      }]
      //@ts-ignore
      const answerGroups=selectAnswerGroups(answerGroup)
      expect(answerGroups.unclaimedAnswerGroups).toStrictEqual([])
      expect(answerGroups.unclaimedRewards).toBe("0")
      expect(answerGroups.answerGroupViews[0]['rewardAmount']).toBe(100)
    });

  });
  
