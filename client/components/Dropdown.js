import React from 'react';
import classnames from 'classnames';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLabel : props.activeLabel,
      displayList : false
    }
  }

  handleOptClick = opt => {
    try { this.props.handleOptClick(); } catch (e) {}
    this.setState({ activeLabel : opt.value, displayList : false });
  }

  toggleList = () => {
    this.setState({ displayList : !this.state.displayList });
  }

  renderLabel = () => {
    switch (typeof this.props.activeLabel) {
      case 'object' : 
      case 'string' : return this.props.activeLabel;

      case 'function' : return <this.props.activeLabel />
      default : return null;
    }
  }

  render() {
    const classNames = this.props.classNames || {};
    const ids = this.props.ids || {};
    const ulClasses = classnames({
      'dropdown-options' : true,
      'hidden' : !this.state.displayList
    }, classNames.ul);

    return (
      <div className={classnames('dropdown', classNames.dropdown)}
           id={ids.dropdown || ''}>
        <div className={classnames('dropdown-label', classNames.label)}
             id={ids.label || ''}
             onClick={this.toggleList}>
          { this.renderLabel() }
        </div>
        <ul className={ulClasses} id={ids.options || ''} 
            ref={el => this.ul = el} onClick={this.toggleList}>
            { this.props.children }
        </ul>
      </div>
    );
  }
}