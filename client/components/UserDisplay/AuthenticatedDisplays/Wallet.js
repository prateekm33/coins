import React from 'react';
import Transactions from './Transactions';
import { 
  WalletTransactions, 
  WalletReceive, 
  WalletSettings 
} from './WalletDisplayItems';
import WalletSend from './WalletSend';
import WalletHeader from './WalletHeader';
import { sendTransaction, getTxns } from '../../../redux/actions/walletActions';

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    // this is a map of the tab options to the corresponding render functions/components
    // see the `render` method for a clearer picture
    this.toolsList = {
      Transactions : () => 
        <Transactions wallet={this.props.wallet} loading={this.state.loadingTxns} showDropdown={false}/>,
      Send : () => <WalletSend wallet={this.props.wallet} />,
      // () => WalletSend(this),
      Receive : () => <WalletReceive addresses={this.state.addresses}/>,
      Settings : () => WalletSettings()
    };
    
    this.state = { 
      txns : [],
      displayRenderFn : this.toolsList.Transactions,
      addresses : null,
      denomination : 'btc',
      loadingTxns : true,
      clicked : 'Transactions'
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.wallet !== this.props.wallet) this.getWalletAddresses(nextProps.wallet);
  }

  getWalletAddresses = wallet => {
    wallet.addresses().then(addresses => {
      // TODO -- query for more if necessary (also need to set that up for wallets page)
      this.setState({ addresses : addresses.addresses });
    }).catch(err => {
      console._error("Error getting addresses for wallet ", wallet.id());
    });
  }

  handleToolsClick = option => {
    if (option === "Receive") this.getWalletAddresses(this.props.wallet);
    
    this.setState({ displayRenderFn : this.toolsList[option], clicked : option });
  }

  renderToolsList = () => {
    const arr = [];
    for (let tab in this.toolsList) {
      arr.push(
        <button onClick={() => this.handleToolsClick(tab)} 
                key={`wallet-tools-tab-${tab}`}
                className={this.state.clicked === tab ? 'active' : ''}>
          {tab}
        </button>
      );
    }
    return arr;
  }

  render() {
    const wallet = this.props.wallet;
    return (
      <div id="wallet-details-container">
        <WalletHeader dropdown={this.props.renderWalletListDropdown()} wallet={wallet} 
                      denomination={this.state.denomination}/>
        <div id="wallet-tools-container">{ this.renderToolsList() }</div>

        { this.state.displayRenderFn() }
      </div>
    );
  }
}

export default Wallet;