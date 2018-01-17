import config from '../../config';

export const saveUserSession = res => {
  res.accessToken = res.accessToken || res.access_token;
  sessionStorage.setItem('uAT', res.accessToken);
}

export const clearUserSession = () => {
  sessionStorage.removeItem('uAT');
}

// fn should be called using `call` or `apply` to bind it to the component contenxt
export const getTxns = (props, skip = 0) => {
  props = props || this.props;
  const wallet = props.wallet;
  if (!wallet) return;
  wallet.transactions({ skip }).then(txns => {
    this.setState({
      txns : txns.transactions, 
      loading : false,
      allTxns : txns.transactions 
    })
  }).catch(err => {
    console._error("Error getting txns for wallet : ", wallet.id());
    this.setState({ loading : false });
  });
}

export const getExplorerURL = () => {
  switch (process.env.NODE_ENV) {
    case 'prod' :
    case 'production' :
      return config.urls.explorers.bitcoin.prod;
    case 'dev' :
    case 'development' :
    default :
      return config.urls.explorers.bitcoin.dev;
  }
}