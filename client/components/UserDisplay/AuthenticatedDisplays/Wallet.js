import React from 'react';
import Transactions from './Transactions';
import { 
  WalletTransactions, 
  WalletReceive, 
  WalletSettings 
} from './WalletDisplayItems';
import WalletSend from './WalletSend';
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

  handleToolsClick = option => {
    if (option === "Receive") {
      this.props.wallet.addresses().then(addresses => {
        // TODO -- query for more if necessary (also need to set that up for wallets page)
        this.setState({ addresses : addresses.addresses });
      }).catch(err => {
        console._error("Error getting addresses for wallet ", this.props.wallet.id());
      });
    }
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
        <div style={{ display : 'flex', flexFlow : 'row', flexWrap : 'nowrap', justifyContent : 'space-between', marginBottom: '10px'}}>

          { this.props.renderWalletListDropdown() }
          

          <div className="wallet-balance">{`${wallet.balance()} ${this.state.denomination.toUpperCase()}`}</div>
        </div>

        <div id="wallet-tools-container">{ this.renderToolsList() }</div>

        { this.state.displayRenderFn() }
      </div>
    );
  }
}

export default Wallet;