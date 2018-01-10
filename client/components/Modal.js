import React from 'react';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal">
        <button className="modal-close" onClick={this.props.close}>Close</button>
        { this.props.children }
      </div>
    );
  }
}