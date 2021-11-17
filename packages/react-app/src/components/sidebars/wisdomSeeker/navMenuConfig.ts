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
        icon: 'nav-icon-upcoming-questions',
        label: 'Biddable Questions',
        getUrl: (params) => {
        return params.isWalletConnected ?
            `/wisdom-seeker/biddable-questions/`
            :
            '/'
        },
        getShouldRender: (params) => {
            return true
        },

    },    
    {
        ...baseMenuItem,
        id: 'myBids',
        icon: 'nav-icon-history',
        label: 'My Bids',
        getUrl: (params) => {
          return params.isWalletConnected ?
            `/wisdom-seeker/mybids`
            :
            '/'
        },
        getShouldRender: (params) => {
          return params.isWalletConnected
        },
    }
]

export default getNavItems;