import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Dropdown from './Dropdown';

const Header = props => {
  return (
    <div id='header'>
      <div id='logo'>
        { /* <img src={TODO} /> */ }
        WALLABIT
      </div>

      { props.user && <ProfileDropdown /> }
    </div>
  );
}


class _ProfileDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.options = [
      'ACCOUNT', // this and settings may be the same thing
      'LOGOUT'
    ];

    this.state = { activeLabel : this.options[0] };
  }

  selectDropdownItem = op => {
    this.setState({ activeLabel : op });
    this.props.history.push(`/${op.toLowerCase()}`);
  }

  renderAvatar = () => {
    return <div>Profile</div>
  }

  render() {
    return (
      <Dropdown activeLabel={this.renderAvatar()} ids={{ dropdown : 'profile-dropdown' }} classNames={{label : 'outlier'}}>
        {
          this.options.map(op => (
            <li key={`pf-dd-list-item:${op}`} onClick={() => this.selectDropdownItem(op)}>
              { op }
            </li>
          ))
        }
      </Dropdown>
    )
  }
}
const ProfileDropdown = withRouter(connect()(_ProfileDropdown));

export default Header;