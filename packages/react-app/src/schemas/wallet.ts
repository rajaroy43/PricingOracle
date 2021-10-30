import * as Yup from 'yup';
import { SUPPORTED_WALLETS } from '../types/user';

export const selectWalletSchema = {
  defaultValues: {
    walletType: '',
  },
  schema: Yup.object({
    walletType: Yup.string().oneOf(Object.keys(SUPPORTED_WALLETS))
      .required('Required')
  })
}