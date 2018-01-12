import React from 'react';
import { Transaction } from './Transactions';
import Spinner from '../../Spinner';
import Dropdown from '../../Dropdown';
import Modal from '../../Modal';

export const WalletTransactions = (txns, loadingTxns) => {
  return (
    <div className="txns-list">
      { 
        loadingTxns ? <Spinner label="Loading transactions"/> :
          txns.map(txn => <Transaction key={txn.id} txn={txn}/>)
      }
    </div>
  );
}

export const WalletSend = self => {
  const wallet = self.props.wallet,
        handleSend = self.verifyTransactionInputs,
        getUserPasscode = self.state.getUserPasscode;
  let formEl;
  return (
    <div id="wallet-send-display">
      <form onSubmit={(evt) => handleSend(formEl, evt)} ref={el => formEl = el}>
        <input placeholder="Deposit address" name="address" required/>
        <div id="amount-input-container">
          <label htmlFor="amount-input">BTC</label>
          <input placeholder="Amount" id="amount-input" name="amount" required/>
        </div>
        <textarea placeholder="Enter a message for this transaction" name="message" rows={10} cols={50} />
        <input type="submit" value="Submit" />
      </form>

      {
        getUserPasscode &&
          <Modal close={() => self.setState({ getUserPasscode : false })}>
            <form onSubmit={evt => self.handleSendTransaction(evt)}>
              <input placeholder="OTP" required name="otp" />
              <input placeholder={"Enter wallet password"} name="walletPassphrase" id="walletPassphrase-input" required/>
              <input type="submit" value="Send" />
            </form>
          </Modal>
      }
    </div>
  );
}

export class WalletReceive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAddress : props.addresses ? props.addresses[0].address : null
    }
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      activeAddress : nextProps.addresses ? nextProps.addresses[0].address : null
    });
  }

  renderDropdown = () => {
    const addresses = this.props.addresses;
    const options = addresses.map(add => ({ value : add.address }));
    return (
      <Dropdown ids={{ dropdown : 'receive-address-dd' }}
                options={options} 
                activeLabel={this.state.activeAddress}>
        {
          options.map(option => (
            <li onClick={() => {
              this.setState({ activeAddress : option });
            }}>{option.value}</li>
          ))
        }
      </Dropdown>
    );
  }

  render() {
    return (
      <div id="wallet-receive-display">
        <div id="deposit-warning-msg" style={{ marginBottom : '30px'}}>
          Deposit only BTC to this address. Depositing any other coin will result in a loss of funds and will be unrecoverable. 
        </div>
        {
          this.props.addresses ? this.renderDropdown() : <Spinner />
        }
      </div>
    )
  }
}

export const WalletSettings = (state, props) => {
  return (
    <div id="wallet-settings-display">
      Settings
    </div>
  );
}
