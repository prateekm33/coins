import { Wallet as BitGoWallet } from 'bitgo';

export default class Wallets {
  constructor(wallets = {}) {
    this.wallets = (wallets.wallets || []).map(wallet => (
      wallet instanceof Wallet ? wallet : new Wallet(wallet)
    ));
  }

  merge = obj => {
    this.wallets = [...this.wallets, ...obj.wallets];
    return new Wallets(this);
  }

  balance = (opts) => {
    return balance(this.wallets, opts);
  }
}

export class Wallet {
  constructor(wallet = {}) {
    this.wallet = wallet;
    this.init();
  }

  init = () => {
    for (let key in this.wallet.wallet) {
      this.get[key] = this.wallet.wallet[key];
    }
    const ignoreKeys = { 
      wallet : 'wallet', 
      get : 'get',
      balance : 'balance'
    };
    for (let key in this.wallet) {
      if (key in ignoreKeys) continue;
      let val = this.wallet[key];
      if (typeof val === 'function') this[key] = val.bind(this.wallet);
      else this[key] = val;
    }
  }

  get = opt => {
    return this.wallet.get(opt);
  }

  balance = opts => {
    return balance([this], opts);
  }

}

function balance(wallets, opts = { decimals : 8, denomination : 'btc' }) {
  let divisor;
  switch (opts.denomination) {
    case 'sat' : 
      divisor = 1;
      break;
    case 'btc' : 
    default : 
      divisor = 1e8;
      break;
  }

  return wallets.reduce((sum, wallet) => {
    return sum + (wallet.get.balance / divisor)
  }, 0).toFixed(opts.decimals);
}