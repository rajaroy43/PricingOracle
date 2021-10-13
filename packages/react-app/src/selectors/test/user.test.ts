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
      const userView=selectUser(user)
      expect(userView.totalBountyDisplay).toBe((user.totalBounty/10000).toString())
      expect(userView.totalRewardsClaimedDisplay).toBe((user.totalRewardsClaimed/10000).toString())
      expect(userView.totalStakedDisplay).toBe((user.totalStaked/10000).toString())
      expect(userView.tokenBalanceDisplay).toBe((user.tokenBalance/10000).toString())
      expect(userView.tokenApprovalBalanceDisplay).toBe((user.tokenApprovalBalance/10000).toFixed(1).toString())
      expect(userView.pricingIsApproved).toBeTruthy()
      expect(userView.questionViews).toBeNull()
    });

    it("Should get all user states as undefined/null/false ", () => {
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