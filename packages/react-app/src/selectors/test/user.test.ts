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
        totalBounty:10,
        totalRewardsClaimed:5,
        totalStaked:12,
        tokenBalance:55,
        tokenApprovalBalance:1000000,
        answerGroups:answerGroup

      }
      //@ts-ignore
      const userData=selectUser(user)
      expect(userData.totalBountyDisplay).toBe((user.totalBounty/10000).toString())
      expect(userData.totalRewardsClaimedDisplay).toBe((user.totalRewardsClaimed/10000).toString())
      expect(userData.totalStakedDisplay).toBe((user.totalStaked/10000).toString())
      expect(userData.tokenBalanceDisplay).toBe((user.tokenBalance/10000).toString())
      expect(userData.tokenApprovalBalanceDisplay).toBe((user.tokenApprovalBalance/10000).toFixed(1).toString())
      expect(userData.pricingIsApproved).toBeTruthy()
      expect(userData.questionViews).toBeNull()
    });

    it("Should get all user states as undefined/null/false ", () => {
        const user={}
        //@ts-ignore
        const userData=selectUser(user)
        expect(userData.totalBountyDisplay).toBeUndefined()
        expect(userData.totalRewardsClaimedDisplay).toBeUndefined()
        expect(userData.totalStakedDisplay).toBeUndefined()
        expect(userData.totalBountyDisplay).toBeUndefined()
        expect(userData.tokenApprovalBalanceDisplay).toBeUndefined()
        expect(userData.pricingIsApproved).toBeFalsy()
        expect(userData.questionViews).toBeNull()
      });
});