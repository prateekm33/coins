import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Spinner from './Spinner';

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
      loading : this.props.loadingBar
    });

    return (
      <div id='top-container'>
        <Header user={this.props.user} />
        <div id="loading-bar">
          {
            this.props.loadingBar && 
              <div className={loadingClasses}></div>
          }
        </div>
        <div id="main-content">
          { !this.props.loading && <MenuBar /> }
          { !this.props.loading && <UserDisplay /> }
          { this.props.loading && <Spinner /> }
          { this.props.contentBusy && <Spinner id="content-busy"/> }
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user : state.user,
    loading : state.appLoading,
    contentBusy : state.contentBusy,
    loadingBar : state.appLoading || state.contentBusy || state.verifyingUser
  };
}
const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;