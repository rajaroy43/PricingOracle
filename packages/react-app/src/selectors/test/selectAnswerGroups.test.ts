import { selectAnswerGroups} from "../answerGroup"
import { AnswerGroupView } from "../../types/answerGroup"
import { AnswerGroup } from "lithium-subgraph"
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
      const expectedUnclaimedRewards=0
      const expectedUnclaimedRewardsDisplay=0
      const expectUnclaimedAnswerGroups:number[]=[]

      //@ts-ignore
      const answerGroupsView=selectAnswerGroups(answerGroup)

      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual(expectUnclaimedAnswerGroups)
      expect(answerGroupsView.unclaimedRewards).toBe(expectedUnclaimedRewards.toString())
      expect(answerGroupsView.answerGroupViews[0]['rewardAmount']).toBe(answerGroup[0].rewardAmount)
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe(expectedUnclaimedRewardsDisplay.toFixed(1))
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
    });

    it("Should  get unclaimedRewards and answergroups  as 0 and [] if empty[] passed", () => {
      const answerGroup: AnswerGroup[]=[]
      const unclaimedAnswerGroups:number[]=[]
      const expectedUnclaimedRewards=0
      const expectedClaimableIds:string[]=[]
      const expectedAnswerGroupViews:AnswerGroupView[]=[]
      const expectedUnclaimedRewardsDisplay=0

      const answerGroupsView=selectAnswerGroups(answerGroup)
      
      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual(unclaimedAnswerGroups)
      expect(answerGroupsView.unclaimedRewards).toBe(expectedUnclaimedRewards.toString())
      expect(answerGroupsView.claimableIds).toStrictEqual(expectedClaimableIds)
      expect(answerGroupsView.answerGroupViews).toStrictEqual(expectedAnswerGroupViews)
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe(expectedUnclaimedRewardsDisplay.toFixed(1))
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
    });
  });
  
