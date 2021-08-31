export interface NavMenuParams {
  activePage: string
  isWalletConnected: boolean
  walletAddress: string | null
}

export interface GetUrl {
  (props: NavMenuParams): string
}

export interface GetShouldRender {
  (props: NavMenuParams): boolean
}

export interface GetIsActive {
  (menuProps: NavMenuParams, itemProps: GetNavItemParams): boolean
}

export interface GetNavItemParams {
  id: string
  icon: string
  label: string
  getUrl: GetUrl
  getShouldRender: GetShouldRender
  getIsActive: GetIsActive
}

export interface NavItemParams {
  id: string
  icon: string
  label: string
  url: string
  shouldRender: boolean
  isActive: boolean
}