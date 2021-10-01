const initialState = {
    connected: false,
    error: {},
    hasLith: false,
    hasApprovedLith: false
};

const [state, setState] = useState(initialState);

const handleWalletConnected = (connected: boolean) => setState({...state, connected: connected, error: false});
const handleWalletError = (error: any) => setState({...state, connected: false, error: error})
const handleWalletHasLith = (hasLith: boolean) => setState({...state, hasLith});
const handleWalletHasApprovedLith = (hasApprovedLith: boolean) => setState({...state, hasApprovedLith});

// if wallet not connected, then show the connect wallet form in <SelectWallet />
if (!state.connected) {
    // show connection form currently displayed in <SelectWallet /> default
    // on error update connection form result via handleWalletError()
    // on success update state with connection form result via handleWalletConnected()
}

// if error on connect wallet form, then display the connect wallet form and the error text 
// (error currently displayed in <SelectWalletError /> inside the <SelectWallet /> component).
// note: the existing error handling in <SelectWallet /> and <SelectWalletError /> handles the error case via the component/form state.
if (state.error) {
    // show connect wallet form with 2 potential errors. Existing implementation contains these error values:
    // 1. errors.wallet: 'Please select a wallet'
    // 2a. errors.providerNetwork: `Network Mismatch. Please connect your wallet to ${errors.networkName} network and Reload.`
    // 2b. errors.networkName (name of the expected network)
}

// if wallet is connected without errors, then check for $LITH in the wallet
if (state.connected && !state.error) {
    // set state.hasLith based on presence of $LITH in wallet via handleWalletHasLith()
}

// if wallet is connected and hasLith is false, then display message about obtaining $LITH
if (state.connected && !state.error && !hasLith) {
    // display message in dialog: "$LITH token is required to use this app." 
    // display a link in the dialog: "Learn how to obtain $LITH" that links to an empty welcome page.
    // display a close button at the bottom of the dialog.
    // close the dialog if user clicks the "Learn..." link.
}

// if wallet is connected and hasLith, then display the $LITH approval form
// $LITH approval for is currently in <ApproveLithiumPricing /> component
if (state.connected && !state.error && state.hasLith && !state.hasApprovedLith) {
    // display an open modal with text: "Approve $LITH for use in this app." with a "Submit Approval" button.
    // on success, update state with approval form result via handleWalletHasApprovedLith()
    // handle form error inside the approval form component, build a more robust error state at this level, 
    // or implement separate app wide chain success/failure logic?
}

// all wallet success conditions met,  hide the connect wallet element.
// display the user profile in the sidebar
// display full content in main content area
if (state.connected && !state.error && state.hasLith && state.hasApprovedLith) {
    // hide connect element
}

// Note: A WalletRequired component has been created to add ConnectWallet functionality to pages requiring wallet connection.