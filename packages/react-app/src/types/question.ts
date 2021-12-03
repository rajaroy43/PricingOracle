import { Question, QuestionBid } from 'lithium-subgraph'

export interface QuestionBidView extends QuestionBid {
  amountDisplay: string;
}

export interface QuestionView extends Question {
  answerSetTotalStakedDisplay: string[];
  bidViews: QuestionBidView[];
  bountyDisplay: string;
  totalStakedDisplay: string;
  endTimeLocal: string;
  topAnswerIndex: number;
  topAnswerValue: string;
  topAnswerDisplay: string;
  isFinished: boolean;
  createdLocal: string;
  pricingTimeDisplay: string;
  userBidView?: QuestionBidView
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
