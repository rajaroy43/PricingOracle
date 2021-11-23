import { GetNavItemParams, GetIsActive } from '../../../types/navigation'

const getIsActive: GetIsActive = (menuProps, itemProps) => {
    return menuProps.activePage === itemProps.id
}
  
export const baseMenuItem = {
    getIsActive
}
  
const getNavItems: GetNavItemParams[] = [
    {
        ...baseMenuItem,
        id: 'suggestAsset',
        icon: 'nav-icon-dashboard',
        label: 'Suggest Asset',
        getUrl: (params) => {
        return params.isWalletConnected ?
            `/wisdom-node/suggestasset/`
            :
            '/'
        },
        getShouldRender: (params) => {
            return true
        },
    },
    {
      ...baseMenuItem,
      id: 'biddableQuestions',
      icon: 'nav-icon-available-sets',
      label: 'Biddable Questions',
      getUrl: (_) => '/wisdom-seeker/biddable-questions',
      getShouldRender: (_) => true,
    },

    /*
    {
        ...baseMenuItem,
        id: 'stats',
        icon: 'nav-icon-stats',
        label: 'Stats / My Profile',
        getUrl: (params) => {
        return params.isWalletConnected ?
            `/stats/${params.walletAddress}`
            :
            '/'
        },
        getShouldRender: (_) => {
        return true
        },
    },
    {
        ...baseMenuItem,
        id: 'staking',
        icon: 'nav-icon-staking',
        label: 'Staking',
        getUrl: (params) => {
        return params.isWalletConnected ?
            `/staking/${params.walletAddress}`
            :
            '/'
        },
        getShouldRender: (_) => {
        return true
        },
    }  
    */  
]

export default getNavItems;