import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import bitgo from '../../../utils/BitGoClient';
import Wallet from './Wallet';
import Dropdown from '../../Dropdown';

class Wallets extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      wallet : null
    };
  }

  renderWallets = walletsObj => {
    if (!walletsObj) return null;

    const wallets = walletsObj.wallets;
    return wallets.map(wallet => (
      <WalletListItem 
        key={wallet.label()} wallet={wallet} 
        denomination={"btc"}
        handleClick={() => this.setState({ wallet : wallet })}/>
    ));
  }

  getTotalWalletBalance(decimals = 8, denomination = "btc" /* e.g. `sat` */) {
    // TODO -- assuming the balances are all in BTC right now 
    // since we are only working with BTC wallets
    // will need to update when upgrading to use multiple currency bases for wallets

    return this.props.wallets.wallets.reduce((sum, wallet) => sum + wallet.balance({ denomination, decimals }), 0);
  }

  navigateTo = (opt = { wallet : null }) => {
    this.setState({
      displayList : !opt.wallet,
      wallet : opt.wallet
    });
  }

  renderWalletListDropdown = () => {
    const activeWalletLabel = this.state.wallet ? this.state.wallet.label() : "Select a wallet";
    return (
      <Dropdown activeLabel={activeWalletLabel} 
                ids={{ label : 'wallet-label'}}>
        {
         this.props.wallets.wallets.map(wallet => (
            <li key={`dd-list-item-${wallet.label()}`} onClick={() => this.navigateTo({ wallet })}>
              {wallet.label()}
            </li>
          ))
        }
      </Dropdown>
    );
  }

  renderWalletsList() {
    const activeWalletLabel = this.state.wallet ? this.state.wallet.label() : "Select a wallet";
    return (
      <div id="wallets-list-container">
        {
          !this.state.wallet ? 
            (
              <ul id="wallets-list">
                <div>{ this.renderWallets(this.props.wallets) }</div>
              </ul>
            ) : 
            <Wallet wallet={this.state.wallet} navigateTo={this.navigateTo} renderWalletListDropdown={this.renderWalletListDropdown}/>
        }
      </div>
    );
  }

  render() {
    return (
      <div id="wallets-page">
        { this.state.wallet && <div className="backBtn" onClick={() => this.navigateTo()}></div> }
        {
          !this.state.wallet && 
            <h2 style={{ display : 'flex', justifyContent : 'space-between', margin : '20px 0px'}}>
              <div id="wallets-page-title">Wallets</div>
              <div id="total-balance">{this.props.wallets.balance()} BTC</div>
            </h2>
        }

        { this.renderWalletsList() }
        
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    wallets : state.wallets
  }
};


const WalletListItem = props => {
  const wallet = props.wallet;
  return (
    <div className="wallet-container" onClick={props.handleClick}>
      <div className="wallet-label">{wallet.label()}</div>
      <div className="wallet-balance">{`${wallet.balance()} ${props.denomination.toUpperCase()}`}</div>
    </div>
  );
}


export default connect(mapStateToProps)(Wallets);