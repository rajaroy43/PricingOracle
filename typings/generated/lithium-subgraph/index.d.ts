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
  created: Scalars['BigInt'];
  group?: Maybe<AnswerGroup>;
};

export type AnswerGroup = {
  __typename?: 'AnswerGroup';
  id: Scalars['ID'];
  questionGroup: QuestionGroup;
  answers: Array<Answer>;
  owner: User;
  rewardAmount: Scalars['BigInt'];
  status: AnswerStatus;
  isRewardCalculated: StatusCalculated;
};

export enum AnswerStatus {
  Unclaimed = 'Unclaimed',
  Claimed = 'Claimed'
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
  questionType: QuestionType;
  owner: User;
  category: QuestionCategory;
  description: Scalars['String'];
  answerSet: Array<Scalars['BigInt']>;
  answerSetTotalStaked: Array<Scalars['BigInt']>;
  bounty: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  endTime: Scalars['BigInt'];
  pricingTime: Scalars['BigInt'];
  isAnswerCalculated: StatusCalculated;
  answerCount: Scalars['BigInt'];
  answers?: Maybe<Array<Answer>>;
  created: Scalars['BigInt'];
  finalAnswerIndex: Scalars['Int'];
  finalAnswerValue: Scalars['BigInt'];
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

export type QuestionGroup = {
  __typename?: 'QuestionGroup';
  id: Scalars['ID'];
  category: QuestionCategory;
  questions: Array<Question>;
  endTime: Scalars['BigInt'];
};

export enum QuestionType {
  Pricing = 'Pricing',
  GroundTruth = 'GroundTruth'
}

export enum StatusCalculated {
  NotCalculated = 'NotCalculated',
  Calculated = 'Calculated'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  questions?: Maybe<Array<Question>>;
  answers?: Maybe<Array<Answer>>;
  answerGroups?: Maybe<Array<AnswerGroup>>;
  questionCount: Scalars['BigInt'];
  totalBounty: Scalars['BigInt'];
  answerCount: Scalars['BigInt'];
  answerGroupCount: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  tokenBalance: Scalars['BigInt'];
  tokenApprovalBalance: Scalars['BigInt'];
  categoryReputations?: Maybe<Array<UserCategoryReputation>>;
};

export type UserCategoryReputation = {
  __typename?: 'UserCategoryReputation';
  id: Scalars['ID'];
  user: User;
  category: QuestionCategory;
  score: Scalars['BigInt'];
};
