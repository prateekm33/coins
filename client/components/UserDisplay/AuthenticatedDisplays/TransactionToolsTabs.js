import { Transaction } from './Transactions';

export const TransactionToolsTabs = props => {
  return (
    <div id={(props.ids || {}).container || ""}>
      {
        props.tabOptions.map((opt, idx) => {
          const classname = classnames('tab-option', {
            active : props.activeIdx === idx
          });
          return <button onClick={() => handleOptionClick.call(props.context, idx) } className={classname}>{opt}</button>
        })
      }
    </div>
  ); 
}

export const renderTxns = (txns, loading) => {
  txns = txns.map(txn => <Transaction key={txn.id} txn={txn} />);
  return txns.length ? 
    <div className="txns-list">{txns}</div> : 
    (
      loading ? 
        <Spinner label="Loading transactions"/> : 
        <div>No transactions to show</div>
    );
}


function handleOptionClick(idx) {
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
