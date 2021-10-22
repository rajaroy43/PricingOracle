import { Question } from 'lithium-subgraph'

export interface QuestionView extends Question {
  answerSetTotalStakedDisplay: string[];
  bountyDisplay: string;
  totalStakedDisplay: string;
  endTimeLocal: string;
  topAnswerIndex: number;
  topAnswerValue: string;
  topAnswerDisplay: string;
  isFinished: boolean;
  createdLocal: string;
  pricingTimeDisplay: string;
}

export enum CategoryLabelDisplay {
  PreIPO,
  Crypto,
  RealEstate,
  NFT
}