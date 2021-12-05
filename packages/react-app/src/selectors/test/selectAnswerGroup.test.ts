import { selectAnswerGroup } from '../answerGroup';
import { selectAnswer } from '../answer';
import { formatUnits } from '../../helpers/formatters';
import { BigNumber } from 'ethers';

describe('Selecting answer Group', () => {
  const questionGroup = {
    id: '0xdaa',
    questions: [
      {
        endTime: 1633719279,
        answerSet: ['0', '1'],
        answerSetTotalStaked: [10, 200],
        bounty: 50,
        totalStaked: 210,
        created: 1633719279,
        startTime: 1633999779,
        pricingTime: 1633719279,
        category: {
          id: 1
        }
      }
    ]
  };
  it('Should get answer group', () => {
    const answerGroup = {
      rewardAmount: 100,
      answers: [
        {
          question: { answerSet: ['0', '1'] },
          answerIndex: 0,
          stakeAmount: 10,
          created: 1633697838
        }
      ],
      questionGroup: questionGroup
    };

    const expectedUnclaimedRewards = answerGroup.rewardAmount;
    const expectedUnclaimedRewardsDisplay = formatUnits(expectedUnclaimedRewards.toString());
    // @ts-ignore
    const expectedAnswerViews = answerGroup.answers.map(selectAnswer);
    const expectedTotalStake = answerGroup.answers
      .reduce((acc, answer) => {
        return acc.add(answer.stakeAmount);
      }, BigNumber.from(0))
      .toString();
    const expectedEarnings = BigNumber.from(answerGroup.rewardAmount)
      .sub(BigNumber.from(expectedTotalStake))
      .toString();
    const expectedEarningsDisplay = formatUnits(expectedEarnings);

    const {
      rewardAmountDisplay,
      answerViews,
      totalStake,
      totalStakeDisplay,
      earnings,
      earningsDisplay
      //@ts-ignore
    } = selectAnswerGroup(answerGroup);

    expect(rewardAmountDisplay).toBe(expectedUnclaimedRewardsDisplay);
    expect(answerViews[0].answerValue).toBe(expectedAnswerViews[0].answerValue);
    expect(answerViews[0].stakeAmountDisplay).toBe(expectedAnswerViews[0].stakeAmountDisplay);
    expect(answerViews[0].createdLocal).toBe(expectedAnswerViews[0].createdLocal);
    expect(totalStake).toBe(expectedTotalStake);
    expect(totalStakeDisplay).toBe(formatUnits(expectedTotalStake));
    expect(earnings).toBe(expectedEarnings);
    expect(earningsDisplay).toBe(expectedEarningsDisplay);
  });

  it('Should  get answer group if having empty answers with  total stake 0', () => {
    const answerGroup = {
      rewardAmount: 100,
      answers: [],
      questionGroup: questionGroup
    };

    const expectedUnclaimedRewards = answerGroup.rewardAmount;
    const expectedUnclaimedRewardsDisplay = formatUnits(expectedUnclaimedRewards.toString());
    const expectedTotalStake = '0';
    const expectedEarnings = BigNumber.from(answerGroup.rewardAmount)
      .sub(BigNumber.from(expectedTotalStake))
      .toString();
    const expectedEarningsDisplay = formatUnits(expectedEarnings);
    const {
      rewardAmountDisplay,
      answerViews,
      totalStake,
      totalStakeDisplay,
      earnings,
      earningsDisplay
      //@ts-ignore
    } = selectAnswerGroup(answerGroup);

    expect(rewardAmountDisplay).toBe(expectedUnclaimedRewardsDisplay);
    expect(answerViews).toStrictEqual([]);
    expect(totalStake).toBe(expectedTotalStake);
    expect(totalStakeDisplay).toBe(formatUnits(expectedTotalStake));
    expect(earnings).toBe(expectedEarnings);
    expect(earningsDisplay).toBe(expectedEarningsDisplay);
  });

  it('Should  not get answer group if reward amount is undefined', () => {
    const answerGroup = {
      answers: [
        {
          question: { answerSet: ['0', '1'] },
          answerIndex: 0,
          stakeAmount: 10,
          created: 1633697838
        }
      ],
      questionGroup: questionGroup
    };

    //will throw when calculate earning means(Total reward- total stake amount )
    //here reward amount is undefined so ,it will throw error as  -
    // "invalid BigNumber value (argument=\"value\", value=undefined, code=INVALID_ARGUMENT
    //  ,version=bignumber/5.4.2)"

    //@ts-ignore
    expect(() => selectAnswerGroup(answerGroup)).toThrow('invalid BigNumber value');
  });

  it('Should  not get answer group if questionGroup is undefined', () => {
    const answerGroup = {
      rewardAmount: 100,
      answers: [
        {
          question: { answerSet: ['0', '1'] },
          answerIndex: 0,
          stakeAmount: 10,
          created: 1633697838
        }
      ]
    };

    //will throw when calculate endtime from questionGroup as (const isFinished = questionGroup.endTime < now)
    //here questionGroup is undefined so ,it will throw error as
    // "Cannot read property 'endTime' of undefined"
    //@ts-ignore
    expect(() => selectAnswerGroup(answerGroup)).toThrow("Cannot read property 'endTime' of undefined");
  });
});
