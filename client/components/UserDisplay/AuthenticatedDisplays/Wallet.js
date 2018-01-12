import React from 'react';
import { connect } from 'react-redux';
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
    const self = this;
    this.toolsList = {
      Transactions : () => WalletTransactions(this.state.txns, this.state.loadingTxns),
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

  componentDidMount = () => 
    this.getTxns();
    // this.props.dispatch(getTxns(this.props.wallet.wallet));

  componentWillReceiveProps = nextProps => {
    this.setState({ loadingTxns : true });
    this.getTxns(nextProps);
    // this.props.dispatch(getTxns(nextProps.wallet.wallet));
  }

  verifyTransactionInputs = (formEl, evt) => {
    evt.preventDefault();
    // validate inputs --- TODO
    if ([formEl.address, formEl.amount]
        .filter(input => !input.value).length) return false;

    this.setState({ 
      getUserPasscode : true,
      sendTransactionForm : formEl
    });
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

  // delete after done implenting redux action for this
  getTxns = (props = this.props, startIndex = 0) => {
    const wallet = props.wallet.wallet;
    wallet.transactions({ skip : startIndex }).then(txns => {
      this.setState({ txns : txns.transactions, loadingTxns : false });
    }).catch(err => {
      console._error("Error getting txns for wallet : ", wallet.id());
    });
    return null;
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