import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../../config';

// import Welcome from './UnAuthenticatedDisplays/Welcome';
// import About from './UnAuthenticatedDisplays/About';
// import Support from './UnAuthenticatedDisplays/Support';
// import FAQ from './UnAuthenticatedDisplays/FAQ';
// import Community from './UnAuthenticatedDisplays/Community';

// import Wallets from './AuthenticatedDisplays/Wallets';
// import Transactions from './AuthenticatedDisplays/Transactions';
// import History from './AuthenticatedDisplays/History';
// import Settings from './AuthenticatedDisplays/Settings';

// const routesToCompMap = {
//   unauth : {
//     [config.routes.unauth.welcome] : Welcome
//     [config.routes.unauth.about] : About,
//     [config.routes.unauth.support] : Support,
//     [config.routes.unauth.faq] : FAQ,
//     [config.routes.unauth.community] : Community,
//   },
//   // auth gated routes
//   auth : {
//     [config.routes.auth.wallets] : Wallets,
//     [config.routes.auth.transactions] : Transactions,
//     [config.routes.auth.history] : History,
//     [config.routes.auth.settings] : Settings
//   }
// };


// const routesToCompMap = {
//   unauth : [
//     config.routes.unauth.welcome,
//     config.routes.unauth.about,
//     config.routes.unauth.support,
//     config.routes.unauth.faq,
//     config.routes.unauth.communit]
//   ],

//   auth : [
//     config.routes.auth.wallets,
//     config.routes.auth.transactions,
//     config.routes.auth.history,
//     config.routes.auth.settings
//   ]
// }

const routesToCompMap = (() => {
  const map = {};
  for (let routeType in config.routes) {
    let routeTypeDir = routeType === 'unauth' ?
      'UnAuthenticatedDisplays' : 'AuthenticatedDisplays';
    for (let routeKey in config.routes[routeType]) {
      let fileName = routeKey[0].toUpperCase() + routeKey.substr(1);
      let routeVal = config.routes[routeType][routeKey];
      map[routeType] = map[routeType] || {};
      map[routeType][routeVal] = require(`./${routeTypeDir}/${fileName}`).default;
    }
  }
  return map;
})();


const UserDisplay = props => {
  return (
    <div id="user-display-container">
      <Switch>
        { renderRoutes(props, routesToCompMap.unauth) }
        { renderRoutes(props, routesToCompMap.auth) }
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  user : state.user
})
export default withRouter(connect(mapStateToProps)(UserDisplay));




function renderRoutes(parentProps, map) {
  const isAuthRoute = map === routesToCompMap.auth;
  const routes = [];
  for (let route in map) {
    let Component = map[route];
    routes.push(
      <Route 
        key={`route-${route}`} 
        path={route} 
        exact={routeShouldBeExact(route)}
        //Use `render` instead of `component` to load the component at the approp. 
        // route to avoid unmounting and remounting new instances of the components
        render={routeProps => {
          if (isAuthRoute && !parentProps.user) { 
            return <Redirect to={{ pathname : config.routes.unauth.welcome }} />
          } else if (!isAuthRoute && parentProps.user) {
            return <Redirect to={{ pathname : config.routes.auth.wallets }} />
          }

          return <Component {...routeProps} />
        }}/>
    );
  }
  return routes;  
}

function routeShouldBeExact(route) {
  return route === config.routes.unauth.welcome;
}