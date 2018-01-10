import React from 'react';
import classnames from 'classnames';
import config from '../../config';

const Address = props => {
  const classes = props.classes || {};
  const containerClasses = classnames('address-container', classes.container);
  const acountClasses = classnames('address', classes.acount);
  const valueClasses = classnames('txn-value', classes.value);
  return (
    <div className={containerClasses}>
      <a className={acountClasses} href={`${config.urls.explorers['bitcoin']}/address/${props.address.account}`} target='_blank'>
        {props.address.account}
      </a>
      <div className={valueClasses}>{(props.address.value / 1e8).toFixed(8)}</div>
    </div>
  )
}

export default Address;