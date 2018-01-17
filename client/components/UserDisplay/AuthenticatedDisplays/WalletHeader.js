import React from 'react';

const WalletHeader = props => {
  const wallet = props.wallet, denomination = props.denomination.toUpperCase();
  return (
    <div style={{ display : 'flex', flexFlow : 'row', flexWrap : 'nowrap', justifyContent : 'space-between', marginBottom: '10px'}}>

      { props.dropdown }

      <div style={{ fontWeight : 'bold' }} className="wallet-balance">{`${wallet.balance()} ${denomination}`}</div>
    </div>
  )
}

export default WalletHeader;