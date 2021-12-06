import { QuestionView } from "../../types/question";
import { ConnectedWalletProps } from "../../types/user";

export interface BiddableItemProps {
  question: QuestionView,
  connectedWallet?: ConnectedWalletProps
}