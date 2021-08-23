export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  Bytes: any;
};

export type Answer = {
  __typename?: 'Answer';
  id: Scalars['ID'];
  answerer: User;
  question: Question;
  answerIndex: Scalars['Int'];
  stakeAmount: Scalars['BigInt'];
  rewardClaimed: Scalars['BigInt'];
  status: AnswerStatus;
  created: Scalars['BigInt'];
  group?: Maybe<AnswerGroup>;
};

export type AnswerGroup = {
  __typename?: 'AnswerGroup';
  id: Scalars['ID'];
  answers: Array<Answer>;
  answerer: User;
};

export enum AnswerStatus {
  Unclaimed = 'UNCLAIMED',
  Claimed = 'CLAIMED'
}



export type PricingContractMeta = {
  __typename?: 'PricingContractMeta';
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  tokenAddress?: Maybe<Scalars['Bytes']>;
  rewardAddress?: Maybe<Scalars['Bytes']>;
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  owner: User;
  category: QuestionCategory;
  description: Scalars['String'];
  answerSet: Array<Scalars['BigInt']>;
  answerSetTotalStaked: Array<Scalars['BigInt']>;
  bounty: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  endTime: Scalars['BigInt'];
  pricingTime: Scalars['BigInt'];
  isRewardCalculated: Scalars['Boolean'];
  answerCount: Scalars['BigInt'];
  answers?: Maybe<Array<Answer>>;
  created: Scalars['BigInt'];
};

export type QuestionCategory = {
  __typename?: 'QuestionCategory';
  id: Scalars['ID'];
  label: Scalars['String'];
  questionCount: Scalars['BigInt'];
  totalBounty: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  rewardedQuestionCount: Scalars['BigInt'];
  questions?: Maybe<Array<Question>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  questions?: Maybe<Array<Question>>;
  answers?: Maybe<Array<Answer>>;
  answerGroups?: Maybe<Array<AnswerGroup>>;
  questionCount: Scalars['BigInt'];
  totalBounty: Scalars['BigInt'];
  answerCount: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  tokenBalance: Scalars['BigInt'];
  tokenApprovalBalance: Scalars['BigInt'];
};
