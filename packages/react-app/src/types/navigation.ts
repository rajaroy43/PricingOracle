export interface PageParams {
  activePage: string
  isWalletConnected: boolean
  walletAddress: string | null
}

export interface NavMenuParams {
  pageParams: PageParams
  getNavItems: GetNavItemParams[]
  setDrawerOpen: SetDrawerOpen
  isDrawerOpen: boolean
}

export interface SetDrawerOpen {
  (isDrawerOpen: boolean) : void
}

export interface GetUrl {
  (props: PageParams): string
}

export interface GetShouldRender {
  (props: PageParams): boolean
}

export interface GetIsActive {
  (menuProps: PageParams, itemProps: GetNavItemParams): boolean
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