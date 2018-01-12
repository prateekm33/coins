import React from 'react';
import classnames from 'classnames';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLabel : props.activeLabel,
      displayList : false
    };
    this.clicked = false;
  }

  componentDidMount = () => {
    document.addEventListener('click', this.handleDocClick);
  }
  componentWillUnMount = () => {
    document.removeEventListener('click', this.handleDocClick);
  }

  registerClick = () => {
    this.clicked = true;
  }

  handleDocClick = evt => {
    // if the click originated outside of this dropdown
    if (!this.clicked) {
      // then make sure that this dropdown list's ul is closed
      this.setState({ displayList : false });
      // and make sure the arrow is pointing down
      this.downArrow.classList.remove('up');
    }
    // reset the clicked boolean flag
    this.clicked = false;
  }

  handleOptClick = opt => {
    try { this.props.handleOptClick(); } catch (e) {}
    this.setState({ activeLabel : opt.value, displayList : false });
  }

  toggleList = evt => {
    // if (evt.target.tagName.toUpperCase() !== 'LI') return;
    this.setState({ displayList : !this.state.displayList });
    this.downArrow.classList.toggle('up');
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
    const ulClasses = classnames('dd-ref', {
      'dropdown-options' : true,
      'hidden' : !this.state.displayList
    }, classNames.ul);

    return (
      <div className={classnames('dropdown', 'dd-ref', classNames.dropdown)}
           id={ids.dropdown || ''} onClick={this.registerClick}>
        <div className={classnames('dropdown-label', 'dd-ref', classNames.label)}
             id={ids.label || ''}
             onClick={this.toggleList}>
          <div>{ this.renderLabel() }</div>
          <div className="down-arrow" ref={el => this.downArrow = el}/>
        </div>
        <ul className={ulClasses} id={ids.options || ''} 
            ref={el => this.ul = el} onClick={this.toggleList}>
            { this.props.children }
        </ul>
      </div>
    );
  }
}