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
      const answerGroupsView=selectAnswerGroups(answerGroup)
      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual([])
      expect(answerGroupsView.unclaimedRewards).toBe("0")
      expect(answerGroupsView.answerGroupViews[0]['rewardAmount']).toBe(100)
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe("0.0")
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
    });

    it("Should  get unclaimedRewards and answergroups  as 0 and [] if empty[] passed", () => {
      const answerGroup: any[]=[]
      //@ts-ignore
      const answerGroupsView=selectAnswerGroups(answerGroup)
      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual([])
      expect(answerGroupsView.unclaimedRewards).toBe("0")
      expect(answerGroupsView.claimableIds).toStrictEqual([])
      expect(answerGroupsView.answerGroupViews).toStrictEqual([])
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe("0.0")
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
    });
  });
  
