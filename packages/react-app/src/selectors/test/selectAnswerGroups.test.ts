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
      const answerGroupData=selectAnswerGroups(answerGroup)
      expect(answerGroupData.unclaimedAnswerGroups).toStrictEqual([])
      expect(answerGroupData.unclaimedRewards).toBe("0")
      expect(answerGroupData.answerGroupViews[0]['rewardAmount']).toBe(100)
      expect(answerGroupData.unclaimedRewardsDisplay).toBe("0.0")
      expect(answerGroupData.hasUnclaimedRewards).toBeFalsy()
    });

    it("Should  get unclaimedRewards and answergroups  as 0 and [] if empty[] passed", () => {
      const answerGroup: any[]=[]
      //@ts-ignore
      const answerGroupData=selectAnswerGroups(answerGroup)
      expect(answerGroupData.unclaimedAnswerGroups).toStrictEqual([])
      expect(answerGroupData.unclaimedRewards).toBe("0")
      expect(answerGroupData.claimableIds).toStrictEqual([])
      expect(answerGroupData.answerGroupViews).toStrictEqual([])
      expect(answerGroupData.unclaimedRewardsDisplay).toBe("0.0")
      expect(answerGroupData.hasUnclaimedRewards).toBeFalsy()
    });
  });
  
