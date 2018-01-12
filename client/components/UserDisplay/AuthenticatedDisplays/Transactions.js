import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import config from '../../../../config';
import Address from '../../Address';
import Spinner from '../../Spinner';
import Dropdown from '../../Dropdown';

import { setActiveWallet } from '../../../redux/actions/userActions';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      txns : [],
      activeIdx : 0,
      loading : false
    };
    this.tabOptions = [
      "All Transactions",
      "Sent Transactions",
      "Received Transactions"
    ];
  }

  componentDidMount = () => this.getTxns();

  componentWillReceiveProps = nextProps => {
    if (nextProps.wallet !== this.props.wallet) this.getTxns(nextProps);
  }

  getTxns = (props = this.props) => {
    if (!props.wallet) return;
    this.setState({ loading : true });
    props.wallet.transactions({})
      .then(txns => {
        this.setState({ 
          txns : txns.transactions, 
          loading : false,
          allTxns : txns.transactions 
        });
      })
      .catch(err => {
        console._error("Error getting transactions for wallet : ", props.wallet.id(), err);
        this.setState({ loading : false });
      });
  }

  handleOptionClick = idx => {
    this.setState({ activeIdx : idx });
    if (idx === 0) {
      // display all txns
      this.setState({ txns : this.state.allTxns });
    } else if (idx === 1) {
      // display only sent txns
      this.setState({ txns : this.state.allTxns.filter(txn => !isOutgoingTxn(txn)) });
    } else if (idx === 2) {
      // display only received txns
      this.setState({ txns : this.state.allTxns.filter(isOutgoingTxn) });
    }
  }

  renderTxns = () => {
    const txns = this.state.txns.map(txn => <Transaction txn={txn} />);
    return txns.length ? <div className="txns-list">{txns}</div> : (
      this.state.loading ? <Spinner label="Loading transactions"/> : <div>No transactions to show</div>
    );
  }

  renderTabs = () => {
    return (
      <div id="tab-options-container">
        {
          this.tabOptions.map((opt, idx) => {
            const classname = classnames('tab-option', {
              active : this.state.activeIdx === idx
            });
            return <button onClick={() => this.handleOptionClick(idx) } className={classname}>{opt}</button>
          })
        }
      </div>
    );
  }

  renderDropdown = () => {
    return (
      <Dropdown activeLabel={this.props.wallet.label() || this.props.wallet.id()} 
                ids={{dropdown : 'wallets-options-dropdown'}}>
        {
          this.props.wallets.map(wallet => (
            <li key={wallet.id()} onClick={() => {
              this.props.dispatch(setActiveWallet(wallet));
              // this.setState({ loading : true });
            }}>
              {wallet.label() || wallet.id()}
            </li>
          ))
        }
      </Dropdown>
    );
  }

  render() {
    return (
      <div id="txns-page" style={{ position : 'relative' /* for the spinner */}}>
        { this.props.showDropdown !== false && <h2 id="txns-page-header">Transactions</h2> }
        {/*
          The transactions component is also used in the wallet page. 
          We use the props.showDropdown boolean to determine whether
          we show the wallet labels or not.

          Show the spinner if we are loading or if there is no selected wallet, because we are probably
          still getting that data. 

          If we are loading, then make sure to unmount any previously loaded txns by adding a boolean
          gate to the `this.renderTxns` call.
        */}
        { !this.props.loading && this.props.wallet ? 
            this.props.showDropdown !== false && this.renderDropdown() : 
            <Spinner />
        }
        { this.renderTabs() }
        { !this.props.loading && this.renderTxns() }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let wallets = state.wallets || {};
  wallets = wallets.wallets || [];
  return {
    wallet : props.wallet || state.activeWallet || wallets[0],
    wallets
  }
};
export default connect(mapStateToProps)(Transactions);


/*
** A single Transaction Component
*/
const INCOMING_TXN = 'INCOMING_TXN';
const OUTGOING_TXN = 'OUTGOING_TXN';
export class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOutgoing : false }
  }

  componentDidMount = () => {
    this.setState({ isOutgoing : isOutgoingTxn(this.props.txn) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isOutgoing : isOutgoingTxn(nextProps.txn) });
  }

  openBlockExplorer = (type, query) => {
    window.open(`${config.urls.explorers['bitcoin']}/${type}/${query}`);
  }

  renderStrangersAddress = () => {
    let boolFn = output => output.isMine;
    if (this.state.isOutgoing) boolFn = output => !output.isMine;

    const outputs = this.props.txn.outputs.filter(boolFn);
    return (
      <div className="stranger-address-container">
        {
          outputs.map(output => (
            <Address key={`${this.props.txn.id}-${output.account}`} address={output}/>
          ))
        }
      </div>
    );
  }

  render() {
    const txn = this.props.txn;
    const txnTypeClassnames = classnames('txn-type', {
      outgoing : this.state.isOutgoing,
      incoming : !this.state.isOutgoing
    });
    const statusClasses = classnames('status', {
      pending : txn.pending
    });

    return (
      <div className="txn-container">
        <div className={txnTypeClassnames}>{
          this.renderStrangersAddress()
        }</div>
        <div className="txn-blockhash">
          <div className="txn-label">Block</div>
          <a href={`${config.urls.explorers['bitcoin']}/block/${txn.blockhash}`} target='_blank'>{txn.blockhash}</a>
        </div>
        <div className="txn-id">
          <div className="txn-label">Hash</div>
          <a href={`${config.urls.explorers['bitcoin']}/tx/${txn.id}`} target='_blank'>{txn.id}</a>
        </div>
        <div style={{ display : 'flex', justifyContent : 'space-between'}}>
          <div className="txn-confirmations">
            <div className="txn-label">Confirmations</div> 
            <div className={txn.pending ? 'yellow' : 'green'}>{txn.confirmations}</div>
          </div>

          <div className={statusClasses}>{txn.pending ? 'Pending' : 'Confirmed'}</div>
        </div>
      </div>
    );
  }
}


/*
** Helper functions below
*/
const isOutgoingTxn = txn => {
    // prob safe to assume that once we find a txn
    // that isMine, we can check the chain and qualify the txn type
    for (let i = 0; i < txn.outputs.length; i++) {
      if (txn.outputs[i].isMine) return checkType(txn.outputs[i]);
    }

    function checkType(output) {
      switch (+output.chain) {
        case 0 :
        case 10:
          return false;
        case 1 :
        case 11:
          return true;
        default : 
          // TODO -- HANDLE ERROR (ALTHOUGH UNLIKELY TO HAPPEN)
      }
    }
  }