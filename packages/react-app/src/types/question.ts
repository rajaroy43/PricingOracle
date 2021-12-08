import { Question, QuestionBid } from 'lithium-subgraph'

export interface QuestionBidView extends QuestionBid {
  amountDisplay: string;
}

export interface QuestionBidsView {
  bidViews: QuestionBidView[];
  topBid: QuestionBidView | null;
  tierFloors: string[];
}

export interface UserQuestionBidView {
  amountNextTier: string;
  amountNextTierDisplay: string;
  isTopBid: boolean;
  isTopTier: boolean;
  bidTier: number;
  nextBidTier: number;
}

export interface QuestionView extends Question {
  answerSetTotalStakedDisplay: string[];
  bountyDisplay: string;
  totalStakedDisplay: string;
  endTimeLocal: string;
  topAnswerIndex: number;
  topAnswerValue: string;
  topAnswerDisplay: string;
  isFinished: boolean;
  isBiddingOpen: boolean;
  isAnsweringOpen: boolean;
  createdLocal: string;
  pricingTimeDisplay: string;
  userBidView: QuestionBidView | null
}

export interface QuestionAndBidsView extends QuestionView {
  questionBidsView: QuestionBidsView;
}

export interface UserBidsView {
  biddingOpenQuestions: QuestionAndBidsView[],
  answeringOpenQuestions: QuestionAndBidsView[],
  answeredQuestions: QuestionAndBidsView[]
}
export enum CategoryLabelDisplay {
  PreIPO,
  Crypto,
  RealEstate,
  NFT
}

export enum QuestionType {
  Pricing,
  GroundTruth
}
