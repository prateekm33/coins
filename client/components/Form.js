import React from 'react';

export default Form extends React.Component {
  constructor(props) {
    super(props);
  }

  formValid = () => {
    // TODO -- custom form validation
    return true;
  }

  handleSubmit = evt => {
    evt.preventDefault();
    if (!this.formValid()) {
      console.error("Form is invalid. Missing some parameters");
      return false;
    }
    this.props.handleSubmit(this.el);
  }

  render() {
    return (
      <form 
        ref={el => this.el = el}
        id={this.props.id} 
        className={this.props.className} 
        onSubmit={this.handleSubmit}>
        { this.props.children }
      </form>
    );
  }
}