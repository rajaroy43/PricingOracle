import { formatUnits } from "../../helpers/formatters"
import { selectUser } from "../user"
  describe("User Selectors", () => {

    it("Should get users states ", () => {
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
      const user={
        totalBounty:'10',
        totalRewardsClaimed:'5',
        totalStaked:'12',
        tokenBalance:'55',
        tokenApprovalBalance:'1000000',
        answerGroups:answerGroup

      }

      const expectedTotalBounty = formatUnits(user.totalBounty)
      const expectedTotalRewardsClaimed = formatUnits(user.totalRewardsClaimed)
      const expectedTotalStaked =formatUnits(user.totalStaked)
      const expectedTotalBalance = formatUnits(user.tokenBalance)
      const expectedTokenApprovalBalance = formatUnits(user.tokenApprovalBalance)

      //@ts-ignore
      const userView=selectUser(user)
      
      expect(userView.totalBountyDisplay).toBe(expectedTotalBounty)
      expect(userView.totalRewardsClaimedDisplay).toBe(expectedTotalRewardsClaimed)
      expect(userView.totalStakedDisplay).toBe(expectedTotalStaked)
      expect(userView.tokenBalanceDisplay).toBe(expectedTotalBalance)
      expect(userView.tokenApprovalBalanceDisplay).toBe(expectedTokenApprovalBalance)
      expect(userView.pricingIsApproved).toBeTruthy()
      expect(userView.questionViews).toBeNull()
    });

    it("Should get all user states as undefined/null/false if providing user as empty", () => {
        const user={}
        //@ts-ignore
        const userView=selectUser(user)
        expect(userView.totalBountyDisplay).toBeUndefined()
        expect(userView.totalRewardsClaimedDisplay).toBeUndefined()
        expect(userView.totalStakedDisplay).toBeUndefined()
        expect(userView.totalBountyDisplay).toBeUndefined()
        expect(userView.tokenApprovalBalanceDisplay).toBeUndefined()
        expect(userView.pricingIsApproved).toBeFalsy()
        expect(userView.questionViews).toBeNull()
      });
});