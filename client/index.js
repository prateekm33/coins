import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './redux/store';
import bitgo from './utils/BitGoClient';
import { logUserIn } from './redux/actions/userActions';

import App from './components/App';

// This is temporary, and should only be used in development mode
// TODO - replace this function with a custom error handler that sends
// messages to an error logger service
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

// init the bitgo client first (this is asynchronous)
bitgo.initClient(getClientOptions())
const Main = (
  <Provider store={store}>
    <BrowserRouter>
      <Route path='/' component={App} />
    </BrowserRouter>
  </Provider>
);
render(Main, document.getElementById('app'));

// TODO -- add better handling for expired tokens and display that as a
// message to the user
// For now, the application will still handle expired tokens but does not show a message
function getClientOptions() {
  let clientOptions = {
    accessToken : sessionStorage.getItem('uAT')
  };

  if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') 
    clientOptions.env = 'prod';
  
  return clientOptions;
}