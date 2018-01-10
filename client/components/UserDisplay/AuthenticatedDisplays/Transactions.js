import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import config from '../../../../config';
import Address from '../../Address';

import { setActiveWallet } from '../../../redux/actions/userActions';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      txns : [],
      activeIdx : 0
    };
    this.tabOptions = [
      "All Transactions",
      "Sent Transactions",
      "Received Transactions"
    ];
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.wallet !== this.props.wallet) this.getTxns(nextProps);
  }

  getTxns = props => {
    props.wallet.transactions({})
      .then(txns => {
        console.warn("transactions : ", txns);
        this.setState({ txns : txns.transactions });
      })
      .catch(err => {
        console.error("Error getting transactions for wallet : ", props.wallet.id(), err);
      });
  }

  renderTxns = () => {
    const txns = this.state.txns.map(txn => <Transaction txn={txn} />);
    return txns.length ? txns : <div>No transactions to show</div>
  }

  handleOptionClick = idx => {
    this.setState({ activeIdx : idx });
    // TODO -- figure out how to display sent and received only
  }

  render() {
    return (
      <div id="txns-page">
        <h2 id="txns-page-header">Transactions</h2>

        <div id="tab-options-container">
          {
            this.tabOptions.map((opt, idx) => {
              const classname = classnames('tab-option', {
                active : this.state.activeIdx === idx
              });
              return <div onClick={() => this.handleOptionClick(idx) } className={classname}>{opt}</div>
            })
          }
        </div>

        <div id="wallets-options-dropdown" className="dropdown">
          <div className="dropdown-label">{this.props.wallet.id()}</div>
          <ul>
            TODO --- WALLETS OPTIONS
          </ul>
        </div>

        <div className="txns-list">
          { this.renderTxns() }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let wallets = state.wallets || {};
  wallets = wallets.wallets || [];
  return {
    wallet : state.activeWallet || wallets[0],
    wallets
  }
};
export default connect(mapStateToProps)(Transactions);


const INCOMING_TXN = 'INCOMING_TXN';
const OUTGOING_TXN = 'OUTGOING_TXN';
export class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOutgoing : false }
  }

  componentDidMount = () => {
    this.setState({ isOutgoing : this.isOutgoingTxn(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isOutgoing : this.isOutgoingTxn(nextProps) });
  }

  isOutgoingTxn = props => {
    // prob safe to assume that once we find a txn
    // that isMine, we can check the chain and qualify the txn type
    for (let i = 0; i < props.txn.outputs.length; i++) {
      if (props.txn.outputs[i].isMine) return checkType(props.txn.outputs[i]);
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
          <div className="label">Block</div>
          <a href={`${config.urls.explorers['bitcoin']}/block/${txn.blockhash}`} target='_blank'>{txn.blockhash}</a>
        </div>
        <div className="txn-id">
          <div className="label">Hash</div>
          <a href={`${config.urls.explorers['bitcoin']}/tx/${txn.id}`} target='_blank'>{txn.id}</a>
        </div>
        <div style={{ display : 'flex', justifyContent : 'space-between'}}>
          <div className="txn-confirmations">
            <div className="label">Confirmations</div> 
            <div className={txn.pending ? 'yellow' : 'green'}>{txn.confirmations}</div>
          </div>

          <div className={statusClasses}>{txn.pending ? 'Pending' : 'Confirmed'}</div>
        </div>
      </div>
    );
  }
}