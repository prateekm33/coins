import React from 'react';

const Spinner = props => {
  return (
    <div className={`spinner ${props.className || ""}`} id={"" || props.id}>
      <div>{props.label}</div>
      <img src={`dist/${require('../../assets/spinner.gif')}`} />
    </div>
  );
}

export default Spinner;