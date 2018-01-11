import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../../config';

import { logoutUser } from '../../redux/actions/userActions';

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
        <Route exact path="/logout" render={renderProps => {
          props.dispatch(logoutUser());
          return <Redirect to={{ pathname : config.routes.unauth.welcome }}/>
        }} />
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