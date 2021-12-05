import { formatUnits, msToLocaleDate } from '../../helpers/formatters';
import { selectAnswer } from '../answer';
describe('Answer Selection', () => {
  it('Should get stakeAmount and local time show ', () => {
    const answer = {
      question: { answerSet: ['0', '1'] },
      answerIndex: 0,
      stakeAmount: '10',
      created: 1633697838
    };
    const expectedCreatedTime = msToLocaleDate(answer.created);
    const expectedSTakeAmount = formatUnits(answer.stakeAmount);

    //@ts-ignore
    const { answerValue, stakeAmountDisplay, createdLocal } = selectAnswer(answer);

    expect(answerValue).toBe(answer.question.answerSet[answer.answerIndex]);
    expect(stakeAmountDisplay).toBe(expectedSTakeAmount.toString());
    expect(createdLocal).toBe(expectedCreatedTime);
  });

  it('Should not get data if stake amount is not defined', () => {
    const answer = {
      question: { answerSet: ['0', '1'] },
      answerIndex: 0,
      created: 1633697838
    };
    const expectedCreatedTime = msToLocaleDate(answer.created);
    // @ts-ignore
    const { answerValue, stakeAmountDisplay, createdLocal } = selectAnswer(answer);
    expect(answerValue).toBe(answer.question.answerSet[answer.answerIndex]);
    expect(stakeAmountDisplay).toBeUndefined;
    expect(createdLocal).toBe(expectedCreatedTime);
  });

  it('Should not get data if date is not ', () => {
    const answer = {
      question: { answerSet: ['0', '1'] },
      answerIndex: 0,
      stakeAmount: '10'
    };
    const expectedSTakeAmount = formatUnits(answer.stakeAmount);
    // @ts-ignore
    const { answerValue, stakeAmountDisplay, createdLocal } = selectAnswer(answer);

    expect(answerValue).toBe(answer.question.answerSet[answer.answerIndex]);
    expect(stakeAmountDisplay).toBe(expectedSTakeAmount.toString());
    expect(createdLocal).toBeUndefined;
  });

  it('Should not get data if stake amount  is not defined ', () => {
    const answer = null;

    //@ts-ignore
    expect(() => selectAnswer(answer)).toThrow("Cannot read property 'stakeAmount' of null");
  });
});
