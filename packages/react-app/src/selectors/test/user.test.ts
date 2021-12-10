import { formatNumber, formatUnits } from "../../helpers/formatters"
import { selectUser } from "../user"
  describe("User Selectors", () => {

    it("Should get users states ", () => {
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
      const user={
        totalBounty:'10',
        totalRewardsClaimed:'5',
        totalStaked:'12',
        tokenBalance:'55',
        tokenApprovalBalance:'1000000',
        answerGroups:answerGroup
      }

      const expectedTotalBounty = formatNumber(formatUnits(user.totalBounty))
      const expectedTotalRewardsClaimed = formatNumber(formatUnits(user.totalRewardsClaimed))
      const expectedTotalStaked = formatUnits(user.totalStaked)
      const expectedTotalStakedDisplay = formatNumber(formatUnits(user.totalStaked)) 
      const expectedTotalBalanceDisplay = formatNumber(formatUnits(user.tokenBalance))
      const expectedTokenApprovalBalance = formatUnits(user.tokenApprovalBalance)

      //@ts-ignore
      const userView=selectUser(user)
      
      expect(userView.totalBountyDisplay).toBe(expectedTotalBounty)
      expect(userView.totalRewardsClaimedDisplay).toBe(expectedTotalRewardsClaimed)
      expect(userView.totalStakedDisplay).toBe(expectedTotalStakedDisplay)
      expect(userView.tokenBalanceDisplay).toBe(expectedTotalBalanceDisplay)
      expect(userView.tokenApprovalBalanceDisplay).toBe(expectedTokenApprovalBalance)
      expect(userView.pricingIsApproved).toBeTruthy()
      expect(userView.questionViews).toBeNull()
    });

    it("Should get all user states as undefined/null/false if providing user as empty", () => {
        const user={}
        //@ts-ignore
        const userView=selectUser(user)
        expect(userView.totalBountyDisplay).toBe('0')
        expect(userView.totalRewardsClaimedDisplay).toBe('0')
        expect(userView.totalStakedDisplay).toBe('0')
        expect(userView.totalBountyDisplay).toBe('0')
        expect(userView.tokenApprovalBalanceDisplay).toBeUndefined()
        expect(userView.pricingIsApproved).toBeFalsy()
        expect(userView.questionViews).toBeNull()
      });
});