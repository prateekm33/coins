import React from 'react';
import QRCode from 'qrcode';
import { Transaction } from './Transactions';
import Spinner from '../../Spinner';
import Dropdown from '../../Dropdown';

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

export class WalletReceive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAddress : props.addresses ? props.addresses[0].address : null
    }
  }

  componentDidMount = () => this.generateQRCode();

  componentWillReceiveProps = nextProps => {
    this.setState({
      activeAddress : nextProps.addresses ? nextProps.addresses[0].address : null
    });

    this.generateQRCode();
  }

  generateQRCode = (address = this.state.activeAddress) => {
    if (!this.qrcanvas || !address) return;
    QRCode.toCanvas(this.qrcanvas, address, err => {
      if (err) console._error('Error generating QR code : ', err);
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
            <li key={`receive-address-item-${option.value}`} onClick={() => {
              this.setState({ activeAddress : option.value });
              this.generateQRCode(option.value);
            }}>{option.value}</li>
          ))
        }
      </Dropdown>
    );
  }

  renderContent = () => {
    return (
      <div style={{
        display : 'flex',
        flexFlow : 'column nowrap',
        alignItems : 'center'
      }}>
        { this.renderDropdown() }
        <canvas style={{ minHeight : '300px', minWidth : '300px' }} ref={el => {
          this.qrcanvas = el;
          // generate the QR code for the first address seen as soon as this element mounts
          this.generateQRCode();
        }} id="qr-code" />
      </div>
    )
  }

  render() {
    return (
      <div id="wallet-receive-display">
        {
          this.props.addresses ? 
            [
              <div key="wallet-receive-content-1" id="deposit-warning-msg" style={{ marginBottom : '30px'}}>
                Deposit only BTC to this address. Depositing any other coin will result in 
                a loss of funds and will be unrecoverable. 
              </div>,
              <div key="wallet-receive-content-2">{this.renderContent()}</div>
            ] : <Spinner />
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
