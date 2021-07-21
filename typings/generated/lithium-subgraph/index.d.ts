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
};

export enum AnswerStatus {
  Unclaimed = 'UNCLAIMED',
  Claimed = 'CLAIMED'
}


export type Question = {
  __typename?: 'Question';
  id: Scalars['ID'];
  owner: User;
  categoryId: Scalars['Int'];
  description: Scalars['String'];
  answerSet: Array<Scalars['BigInt']>;
  answerSetTotals: Array<Scalars['BigInt']>;
  bounty: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  endTime: Scalars['BigInt'];
  answerCount: Scalars['BigInt'];
  answers?: Maybe<Array<Answer>>;
  created: Scalars['BigInt'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  questions?: Maybe<Array<Question>>;
  answers?: Maybe<Array<Answer>>;
  questionCount: Scalars['BigInt'];
  totalBounty: Scalars['BigInt'];
  answerCount: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  tokenBalance: Scalars['BigInt'];
  tokenApprovalBalance: Scalars['BigInt'];
};
