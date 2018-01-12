import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import config from '../../../../config';

import { loginUser } from '../../../redux/actions/userActions';
import Spinner from '../../Spinner';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal : false,
      errors : null
    }
  }

  showLoginModal = () => {
    this.setState({ showLoginModal : true });
  }

  getSignUpLink = () => {
    switch (process.env.NODE_ENV) {
      case 'prod' :
      case 'production' :
        return config.urls.bitgo.signup.prod;
      case 'dev' : 
      case 'development' :
      default :
        return config.urls.bitgo.signup.dev;
    }
  }

  render() {
    return (
      <div id="welcome-page">
        {
          !this.state.showLoginModal &&
            <h2 id="description-blurb">
              WallaBit is an easy and intuitive user interface for managing your BitGo wallets. 
            </h2>
        }
        {
          !this.state.showLoginModal &&
            <div>
              <div id="login-btn" onClick={this.showLoginModal}>
                Already an existing BitGo user? Click here!
              </div>
              <a style={{ marginBottom : '30px' }} href={this.getSignUpLink()} target='_blank'>
                Not a BitGo user? Click here to create an account on BitGo!
              </a>
            </div>
        }

        {
          this.state.showLoginModal && 
            <LoginModalConnected />
        }
      </div>
    );
  }
}

// need to get BitGo client id/authorization to use OAuth API
        // <button className="cta-signup">Sign up with BitGo!</button>

class LoginModal extends React.Component { 
  constructor(props) { 
    super(props);
    this.state = {
      loginError : null
    };
  }

  componentDidMount = () => {
    this.formEl.username.focus();
  }

  onSubmit = evt => {
    evt.preventDefault();
    const inputs = this.formEl.children;
    const user = this.getUserInput(inputs);

    this.props.dispatch(loginUser(user)).then(res => {
      if (!res.error) this.props.history.push('/wallets');
      else {
        /*
        ** TODO - better error handling messages that
        ** show detailed responses to user. 
        */
        this.setState({ loginError : res.msg }, () => {
          this.formEl.username.focus();
          console.log('active : ', document.activeElement);
        });
      }
    });
  }

  getUserInput = inputs => {
    return Array.prototype.slice.call(inputs).reduce((user, input) => {
      user.username = input.id === 'username-input' ? input.value : user.username;
      user.password = input.id === 'password-input' ? input.value : user.password;
      user.otp = input.id === 'otp-input' ? input.value : user.otp;
      return user;
    }, {});
  }

  render() {
    const props = this.props;
    const unInClassnames = classnames(props.errors && props.errors['username-input']);
    const pwInClassnames = classnames(props.errors && props.errors['password-input']);
    const otpInClassnames = classnames(props.errors && props.errors['otp-input']);
    return (
      <div id="login-modal">
        {
          !props.loading ?
            <form id="login-form" onSubmit={this.onSubmit} ref={el => this.formEl = el}>
              { this.state.loginError &&
                  <button onClick={evt => this.setState({loginError : null})} 
                          id="error-msg" type="button">
                    {this.state.loginError}
                  </button> 
              }
              <input
                placeholder="username/email" type="text" required
                id="username-input" name="username" className={unInClassnames}/>
              <input 
                placeholder="password" type="password"  required
                id="password-input" className={pwInClassnames}/>
              <input 
                placeholder="OTP/Google Authenticator Code" type="text"
                id="otp-input" classnames={otpInClassnames} required/>
              <input type="submit" value="Log In" />
            </form>
            : <Spinner label={"Logging in"}/> 
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading : state.verifyingUser
});
const LoginModalConnected = withRouter(connect(mapStateToProps)(LoginModal));

export default connect(mapStateToProps)(Welcome);