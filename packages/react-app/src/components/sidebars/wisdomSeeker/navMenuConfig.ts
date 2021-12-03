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
            `/wisdom-seeker/suggest-asset/`
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
        getUrl: (params) => {
            return params.isWalletConnected ?
              `/wisdom-seeker/biddable-questions`
              :
              '/'
          },
          getShouldRender: (params) => {
            return params.isWalletConnected
          },
    },     
    {
        ...baseMenuItem,
        id: 'myBids',
        icon: 'nav-icon-history',
        label: 'My Bids',
        getUrl: (params) => {
          return params.isWalletConnected ?
            `/wisdom-seeker/my-bids`
            :
            '/'
        },
        getShouldRender: (params) => {
          return params.isWalletConnected
        },
    },
    {
        ...baseMenuItem,
        id: 'myAnswers',
        icon: 'nav-icon-history',
        label: 'My Answers',
        getUrl: (params) => {
          return params.isWalletConnected ?
            `/wisdom-seeker/my-answers`
            :
            '/'
        },
        getShouldRender: (params) => {
          return params.isWalletConnected
        },
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
        },
        getShouldRender: (params) => {
          return params.isWalletConnected
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