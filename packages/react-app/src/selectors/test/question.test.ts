import { formatNumber, formatUnits, msToLocaleDate, msToSec, secToLocaleDate } from '../../helpers/formatters';
import { generateAnswerSetOptions, selectQuestionBid, selectQuestion } from '../question';
describe('Answer set labels description', () => {
  it('Should generate answer set labels', () => {
    const answerSetDisplay = ['1.0000', '2.0000', '3.0000'];
    const answerSetLabels = generateAnswerSetOptions(answerSetDisplay);
    expect(answerSetLabels[0]['label']).toBe(`Greater Than or Equal to ${answerSetDisplay[0]} or  Less Than ${answerSetDisplay[1]}`);
    expect(answerSetLabels[1]['label']).toBe(`Greater Than or Equal to ${answerSetDisplay[1]} or  Less Than ${answerSetDisplay[2]}`);
    expect(answerSetLabels[2]['label']).toBe(`Greater Than or Equal to ${answerSetDisplay[2]}`);
  });

  it('Should generate empty answer set labels for empty answer sets', () => {
    const answerSet: string[] = [];
    const expectedAnswerSetLabels: any[] = [];
    const answerSetLabels = generateAnswerSetOptions(answerSet);
    expect(answerSetLabels).toStrictEqual(expectedAnswerSetLabels);
  });
});

describe('Question Bid Selection', () => {
  it('Should get question bid data', () => {
    const bid = { amount: '10' };
    const expectedBidAmountDisplay = formatUnits(bid.amount);
    // @ts-ignore
    const { amountDisplay } = selectQuestionBid(bid);
    expect(amountDisplay).toBe(expectedBidAmountDisplay);
  });

  it('Should get question bid amount display as undefined if empty data {} provided', () => {
    const bid = {};
    // @ts-ignore
    const { amountDisplay } = selectQuestionBid(bid);
    expect(amountDisplay).toBeUndefined;
  });
});

describe('Question  Selection', () => {
  let question: any;

  beforeEach(() => {
    question = {
      endTime: 1633719279,
      answerSet: ['0', '1'],
      answerSetTotalStaked: ['10', '200'],
      bounty: '50',
      totalStaked: '210',
      created: 1633719279,
      startTime: 1633999779,
      pricingTime: 1633719279,
      category: {
        id: 1
      },
      bids: ['10', '20', '30']
    };
  });
  it('Should get question data', () => {
    const expectedAnswerSetTotalStakedDisplay = question.answerSetTotalStaked.map(formatUnits);
    const expectedBountyDisplay = formatNumber(formatUnits(question.bounty));
    const expectedTotalStakedDisplay = formatUnits(question.totalStaked);
    const expectedEndTimeLocal = secToLocaleDate(question.endTime);
    const now = msToSec(new Date().getTime());
    const expectedIsAnsweringTimeFinished = question.endTime < now;
    const expectedCreatedLocal = msToLocaleDate(question.created);

    // @ts-ignore
    const {
      answerSetTotalStakedDisplay,
      totalStakedDisplay,
      bountyDisplay,
      endTimeLocal,
      isFinished,
      createdLocal
    } = selectQuestion(question);

    expect(answerSetTotalStakedDisplay).toStrictEqual(expectedAnswerSetTotalStakedDisplay);
    expect(bountyDisplay).toBe(expectedBountyDisplay);
    expect(totalStakedDisplay).toBe(expectedTotalStakedDisplay);
    expect(endTimeLocal).toBe(expectedEndTimeLocal);
    expect(createdLocal).toBe(expectedCreatedLocal);
    expect(isFinished).toBe(expectedIsAnsweringTimeFinished);
  });

  it('Should  get question data with end time local as invalid date if end time is not defined', () => {
    question.endTime = undefined;
    // @ts-ignore
    const { endTimeLocal } = selectQuestion(question);
    expect(endTimeLocal).toBe('Invalid Date');
  });

  it('Should  not get question data ,if answer set total staked  undefined', () => {
    question.answerSetTotalStaked = undefined;
    // @ts-ignore
    expect(() => selectQuestion(question)).toThrow("Cannot read property 'reduce'");
  });
  it('Should  not get question data if answer set undefined', () => {
    question.answerSet = undefined;
    // @ts-ignore
    expect(() => selectQuestion(question)).toThrow("Cannot read property 'map'");
  });
});
