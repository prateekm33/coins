import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import Spinner from '../../Spinner';
import { sendTransaction } from '../../../redux/actions/walletActions';

class WalletSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendingTransaction : false,
      amountError : null,
      addressError : null,
      sendError : null,
      getUserPasscode : false,
      formEl : null
    }
  }

  validateSendAmount = evt => {
    const val = +evt.target.value;
    if (val <= this.props.wallet.balance()) return;
    this.setState({
      amountError : { 
        error : true, 
        message : 'You do not have sufficient funds for this transaction' 
      }
    });
  }

  removeErrorState = type => {
    if (type === 'address') {
      if (this.state.addressError) this.setState({ addressError : null });
    } else if (type === 'amount') {
      if (this.state.amountError) this.setState({ amountError : null });
    } else if (type === 'send') {
      if (this.state.sendError) this.setState({ sendError : null });
    }
  }

  submitFormOne = evt => {
    evt.preventDefault();
    this.setState({ 
      getUserPasscode : true,
      formEl : this.formOne
    });
  }

  handleSendTransaction = evt => {
    evt.preventDefault();
    this.state.formEl.walletPassphrase = evt.target.walletPassphrase;
    this.state.formEl.otp = evt.target.otp;
    this.setState({ sendingTransaction : true });
    this.props.dispatch(
      sendTransaction(this.state.formEl, this.props.wallet, 'BTC')
    ).then(res => {
      const state = { 
        sendingTransaction : false,
        getUserPasscode : false
      };
      switch (res.type) {
        case 'address' :
          state.addressError = { error : true, message : res.message };
          break;
        case 'amount' : 
          state.amountError = { error : true, message : res.message };
          break;
        case 'password' :
          // stay on passcode form
          state.getUserPasscode = true;
          state.passphraseError = { error : true, message : res.message };
          break;
        default : 
          state.sendError = { error : true, message : res.message };
          break;
      }

      if (!res.error) state.formEl = null;
      this.setState(state);
    });
  }

  componentDidUpdate = () => {
    if (!this.state.formEl || !this.formOne) return;
    this.formOne.address.value = this.state.formEl.address.value;
    this.formOne.amount.value = this.state.formEl.amount.value;
    this.formOne.message.value = this.state.formEl.message.value;
  }

  renderFormOne = () => {
    return (
      <form onSubmit={this.submitFormOne} ref={el => this.formOne = el}>
        { this.state.sendError && 
            <div id="send-error">
              <div>{this.state.sendError.message}</div>
              <div onClick={() => this.setState({ sendError : null })}/>
            </div>
        }

        <div id="address-input-container">
          <input onChange={() => this.removeErrorState('address')} 
                 placeholder="Enter deposit address" name="address" id="address-input" required />
          <InputError error={this.state.addressError}/>
        </div>

        <div id="amount-input-container">
          <div style={{ width : '100%' }}>
            <label htmlFor="amount-input">BTC</label>
            <input className={this.state.amountError ? "error" : ""} onBlur={this.validateSendAmount} 
                   onChange={() => this.removeErrorState('amount')} placeholder="Enter amount" 
                   id="amount-input" name="amount" required/>
          </div>

          <InputError error={this.state.amountError}/>
        </div>

        <textarea placeholder="Enter a message for this transaction" name="message" 
                  rows={10} cols={50} style={{ padding : '10px' }}/>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  renderFormTwo = () => {
    return (
      <Modal closeLabel="Back" close={() => this.setState({ getUserPasscode : false })}>
        <form onSubmit={this.handleSendTransaction}>
          <input placeholder="OTP" required name="otp" />
          <div style={{ marginBottom : '30px' }}>
            <input type="password" placeholder={"Enter wallet password"} name="walletPassphrase" id="walletPassphrase-input" required/>
            <InputError error={this.state.passphraseError}/>
          </div>
          <input style={{ marginBottom : '5px' }} type="submit" value={
            this.state.sendingTransaction ? 'Sending transaction...' : 'Send'
          }/>
        </form>
      </Modal>
    );
  }

  render() {
    return (
      <div id="wallet-send-display">
        {
          !this.state.sendingTransaction ?
            (!this.state.getUserPasscode ? this.renderFormOne() : this.renderFormTwo()) :
            <Spinner />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({});


const InputError = props => {
  return (
    <div style={{ 
      fontSize : '10px', 
      color : 'red', 
      visibility : props.error ? 'visible' : 'hidden'
    }}>
      {(props.error || '').message}
    </div> 
  );
}

export default connect(mapStateToProps)(WalletSend);