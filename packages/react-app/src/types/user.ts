import { User } from 'lithium-subgraph'
import { AnswerGroupsView } from './answerGroup';
import { QuestionView } from './question';

export interface UserView extends User {
  totalBountyDisplay: string;
  totalRewardsClaimedDisplay: string;
  totalStakedDisplay: string;
  tokenBalanceDisplay: string;
  tokenApprovalBalanceDisplay: string;
  pricingIsApproved: boolean;
  questionViews: QuestionView[];
  answerGroupsView: AnswerGroupsView;
}

export enum SUPPORTED_WALLETS {
  METAMASK = 'METAMASK',
  // FORTMATIC: 'FORTMATIC'
}

export interface ConnectedWallet {
  walletType?: SUPPORTED_WALLETS;
  wallet?: any;
  address?: string;
  provider?: any;
  tokenInstance?: any;
  pricingInstance?: any;
  updaters: {
    setWallet: any;
  }
}