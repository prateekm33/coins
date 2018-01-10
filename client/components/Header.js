import React from 'react';
import { connect } from 'react-redux'

import Dropdown from './Dropdown';

const Header = props => {
  return (
    <div id='header'>
      <div id='logo'>
        { /* <img src={TODO} /> */ }
        WALLABIT
      </div>

      { props.user ? <ProfileDropdown /> : <AuthButtons /> }
    </div>
  );
}


class _ProfileDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.options = [
      'ACCOUNT', // this and settings may be the same thing
      'HISTORY',
      'SETTINGS'
    ];

    this.state = { activeLabel : this.options[0] };
  }

  selectDropdownItem = op => {
    this.setState({ activeLabel : op });
  }

  renderAvatar = () => {
    return <div>temp avatar</div>
  }

  render() {
    return (
      <Dropdown activeLabel={this.renderAvatar()} ids={{ dropdown : 'profile-dropdown' }}>
        {
          this.options.map(op => (
            <li key={`pf-dd-list-item:${op}`} onClick={() => this.selectDropdownItem(op)}>
              { op }
            </li>
          ))
        }
      </Dropdown>
    )
    return (
      <div id="profile-dropdown" className="dropdown-container">
        <div className="dropdown-button">
          PROFILE_AVATAR
        </div>
        <ul className="dropdown-options">
          {
            this.options.map(op => (
              <li key={`pf-dd-list-item:${op}`}>
                { op.toUpperCase() }
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
const ProfileDropdown = connect()(_ProfileDropdown);

class _AuthButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='auth-buttons'>
        <button>Log In</button>
        <button>Sign up</button>
      </div>
    );
  }
}
const AuthButtons = connect()(_AuthButtons);

export default Header;