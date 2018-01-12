import React from 'react';
import { connect } from 'react-redux';
import Transactions from './Transactions';
import { 
  WalletTransactions, 
  WalletSend, 
  WalletReceive, 
  WalletSettings 
} from './WalletDisplayItems';
import { sendTransaction, getTxns } from '../../../redux/actions/walletActions';

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    // this is a map of the tab options to the corresponding render functions/components
    // see the `render` method for a clearer picture
    this.toolsList = {
      Transactions : () => 
        <Transactions wallet={this.props.wallet} loading={this.state.loadingTxns} showDropdown={false}/>,
      Send : () => WalletSend(this),
      Receive : () => <WalletReceive addresses={this.state.addresses}/>,
      Settings : () => WalletSettings()
    };
    
    this.state = { 
      txns : [],
      displayRenderFn : this.toolsList.Transactions,
      addresses : null,
      getUserPasscode : false,
      denomination : 'btc',
      loadingTxns : true,
      clicked : 'Transactions'
    };
  }

  handleSendTransaction = evt => {
    evt.preventDefault();
    this.state.sendTransactionForm.walletPassphrase = evt.target.walletPassphrase;
    this.state.sendTransactionForm.otp = evt.target.otp;
    this.props.dispatch(
      sendTransaction(this.state.sendTransactionForm, this.props.wallet, 'BTC')
    );
    this.setState({
      sendTransactionForm : null,
      getUserPasscode : false
    });
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

export default connect()(Wallet);