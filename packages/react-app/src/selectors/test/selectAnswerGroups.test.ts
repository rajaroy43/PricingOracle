import { selectAnswerGroups} from "../answerGroup"
import { AnswerGroupView } from "../../types/answerGroup"
import { AnswerGroup } from "lithium-subgraph"
import { formatNumber, formatUnits } from "../../helpers/formatters"
  describe("Selecting answer Groups", () => {
    
    it("Should get unclaimedRewards and answergroups if reward is NotCalculated", () => {

      const questionGroup={
        id:'0xdaa',
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
      }
      const answerGroup=[{
        isRewardCalculated:"NotCalculated",
        rewardAmount:100,
        answers:[{
            question:{answerSet:['0', '1']},
            answerIndex: 0,
            stakeAmount: 10,
            created: 1633697838,
        }],
        questionGroup:questionGroup
      }]
      const expectedUnclaimedRewards=0
      const expectedUnclaimedRewardsDisplay=0.0000
      const expectUnclaimedAnswerGroups:number[]=[]
      const expectedClaimableIds:string[]=[]
      const expectedEarnings = answerGroup[0].rewardAmount-answerGroup[0].answers[0].stakeAmount
      const expectedEarningsDisplay = formatUnits(expectedEarnings.toString())

      //@ts-ignore
      const answerGroupsView=selectAnswerGroups(answerGroup)

      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual(expectUnclaimedAnswerGroups)
      expect(answerGroupsView.unclaimedRewards).toBe(expectedUnclaimedRewards.toString())
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe(expectedUnclaimedRewardsDisplay)
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
      expect(answerGroupsView.claimableIds).toStrictEqual(expectedClaimableIds)
      expect(answerGroupsView.answerGroupViews[0]['rewardAmount']).toBe(answerGroup[0].rewardAmount)
      expect(answerGroupsView.answerGroupViews[0].earnings).toBe(expectedEarnings.toString())
      expect(answerGroupsView.answerGroupViews[0].earningsDisplay).toBe(expectedEarningsDisplay)

    });

    it("Should get claimedRewards and answergroups if reward is Calculated", () => {

      const questionGroup={
        id:'0xdaa',
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
      }
      const answerGroup=[{
        isRewardCalculated:"Calculated",
        rewardAmount:100,
        answers:[{
            question:{answerSet:['0', '1']},
            answerIndex: 0,
            stakeAmount: 10,
            created: 1633697838,
        }],
        questionGroup:questionGroup
      }]
      const expectedUnclaimedRewards=answerGroup[0].rewardAmount
      const expectedUnclaimedRewardsDisplay=formatNumber(formatUnits(expectedUnclaimedRewards))
      const expectedClaimableIds:string[]=[answerGroup[0].questionGroup.id]
      const expectedEarnings = answerGroup[0].rewardAmount-answerGroup[0].answers[0].stakeAmount
      const expectedEarningsDisplay = formatUnits(expectedEarnings.toString())

      //@ts-ignore
      const answerGroupsView=selectAnswerGroups(answerGroup)

      expect(answerGroupsView.unclaimedRewards).toBe(expectedUnclaimedRewards.toString())
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe(expectedUnclaimedRewardsDisplay)
      expect(answerGroupsView.hasUnclaimedRewards).toBeTruthy()
      expect(answerGroupsView.claimableIds).toStrictEqual(expectedClaimableIds)
      expect(answerGroupsView.answerGroupViews[0]['rewardAmount']).toBe(answerGroup[0].rewardAmount)
      expect(answerGroupsView.answerGroupViews[0].earnings).toBe(expectedEarnings.toString())
      expect(answerGroupsView.answerGroupViews[0].earningsDisplay).toBe(expectedEarningsDisplay)

    });

    it("Should  get unclaimedRewards and answergroups  as 0 and [] , if empty[] passed", () => {
      const answerGroup: AnswerGroup[]=[]
      const unclaimedAnswerGroups:number[]=[]
      const expectedUnclaimedRewards=0.0000
      const expectedClaimableIds:string[]=[]
      const expectedAnswerGroupViews:AnswerGroupView[]=[]
      const expectedUnclaimedRewardsDisplay=0

      const answerGroupsView=selectAnswerGroups(answerGroup)
      
      expect(answerGroupsView.unclaimedAnswerGroups).toStrictEqual(unclaimedAnswerGroups)
      expect(answerGroupsView.unclaimedRewards).toBe(expectedUnclaimedRewards.toString())
      expect(answerGroupsView.unclaimedRewardsDisplay).toBe(expectedUnclaimedRewardsDisplay.toFixed(1))
      expect(answerGroupsView.hasUnclaimedRewards).toBeFalsy()
      expect(answerGroupsView.claimableIds).toStrictEqual(expectedClaimableIds)
      expect(answerGroupsView.answerGroupViews).toStrictEqual(expectedAnswerGroupViews)
    });
  });
  
