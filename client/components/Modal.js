import React from 'react';

const Modal = props => {
  return (
    <div className="modal">
      <button className="modal-close" onClick={props.close}>{props.closeLabel || "Close"}</button>
      { props.children }
    </div>
  );
}

export default Modal;