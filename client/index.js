import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './redux/store';
import bitgo from './utils/BitGoClient';
import { logUserIn } from './redux/actions/userActions';

import App from './components/App';

window.console._error = (...args) => {
  switch ((process.env.NODE_ENV || '').toLowerCase()) {
    case 'prod':
    case 'production':
      return () => {};
    case 'dev':
    case 'development':
    default :
      return console.error(...args);
  }
}

bitgo.initClient(getClientOptions())
// .then(user => {
  // if (user) store.dispatch(logUserIn(user));
  const Main = (
    <Provider store={store}>
      <BrowserRouter>
        <Route path='/' component={App} />
      </BrowserRouter>
    </Provider>
  );
  render(Main, document.getElementById('app'));
// });


function getClientOptions() {
  // const uAT = JSON.parse(sessionStorage.getItem('uAT'));
  // const { accessToken, expires } = uAT;
  let clientOptions = {
    accessToken : sessionStorage.getItem('uAT')
  };

  // if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') 
    // clientOptions.env = 'prod';
  
  return clientOptions;
}