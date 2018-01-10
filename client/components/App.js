import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { requestWallets } from '../redux/actions/userActions';

// component dependencies
import Header from './Header';
import MenuBar from './MenuBar';
import UserDisplay from './UserDisplay';
import Footer from './Footer';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loadingClasses = classnames({
      loading : this.props.loading
    });

    return (
      <div id='top-container'>
        <Header user={this.props.user} />
        <div id="loading-bar"><div className={loadingClasses}></div></div>
        <div id="main-content">
          <MenuBar />
          <UserDisplay />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mainLoadingBar : state.loading,
    user : state.user
  };
}
const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;