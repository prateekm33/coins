import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import config from '../../config';

const AUTH_ITEMS = 'authItems';
const UNAUTH_ITEMS = 'unauthItems';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this[UNAUTH_ITEMS] = initMenuItems(config.routes.unauth);
    this[AUTH_ITEMS] = initMenuItems(config.routes.auth);

    function initMenuItems(routes) {
      const items = [];
      for (let key in routes) {
        items.push({ title : key, url : routes[key] });
      }
      return items;
    }
  }

  renderMenuItems(arrKey) {
    return this[arrKey].map(item => (
      <li key={item.url}>
        <Link className="nav-list-item" to={item.url}>{item.title}</Link>
      </li>
    ));
  }

  render() {
    return (
      <div id="side-bar">
        <ul id="side-bar-nav">
          { this.renderMenuItems(this.props.user ? AUTH_ITEMS : UNAUTH_ITEMS) }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user : state.user
});

export default connect(mapStateToProps)(MenuBar);