import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { loginUser } from '../../../redux/actions/userActions';


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

  onSubmit = evt => {
    evt.preventDefault();
    const inputs = this.formEl.children;
    const errors = this.validateInputs(inputs);
    if (errors) {
      this.setState({ errors });
      return;
    }

    const user = this.getUserInput(inputs);
    this.props.dispatch(loginUser(user)).then(done => {
      if (done) this.props.history.push('/wallets');
    });
  }

  validateInputs = inputs => {
    const errors = Array.prototype.slice.call(inputs).reduce((errors, input) => {
      // TODO -- validate email as an additional feature
      if (input.type === 'submit' || input.value) return errors;
      return {...errors, [input.id] : true };
    }, {});

    return Object.keys(errors).length ? errors : null;
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
    return (
      <div id="welcome-page">
        <div id="description-blurb">
          WallaBit is an easy and intuitive user interface for managing your BitGo wallets. 
        </div>
        <div id="login-btn" onClick={this.showLoginModal}>
          Already an existing BitGo user?
        </div>

        {
          this.state.showLoginModal && 
            <LoginModal onSubmit={this.onSubmit} 
              saveFormEl={el => this.formEl = el} 
              errors={this.state.errors} />
        }
      </div>
    );
  }
}

// need to get BitGo client id/authorization to use OAuth API
        // <button className="cta-signup">Sign up with BitGo!</button>

const LoginModal = props => {
  const unInClassnames = classnames(props.errors && props.errors['username-input']);
  const pwInClassnames = classnames(props.errors && props.errors['password-input']);
  const otpInClassnames = classnames(props.errors && props.errors['otp-input']);
  return (
    <div id="login-modal">
      {props.errors && <div id="login-error-msg"> The email and password combination does not match</div>}
      <form id="login-form" onSubmit={props.onSubmit} ref={props.saveFormEl}>
        <input 
          placeholder="username/email" type="text" 
          id="username-input" className={unInClassnames}/>
        <input 
          placeholder="password" type="password" 
          id="password-input" className={pwInClassnames}/>
        <input 
          placeholder="OTP/Google Authenticator Code" type="text"
          id="otp-input" classnames={otpInClassnames}/>
        <input type="submit" value="Log In" />
      </form>
    </div>
  );
}


export default connect()(Welcome);