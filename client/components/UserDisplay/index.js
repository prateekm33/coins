import React from 'react';
import { Switch, Route, Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../../config';

import { logoutUser } from '../../redux/actions/userActions';

/*
** This is where the client side Router for the application is configured.
** When adding new routes to the application, make sure that the component files are defined 
** in either the AuthenticatedDisplays dir or the UnAuthenticatedDisplays folder.
**
** Also ensure that the routes are defined in the config.json file within the root directory.
**
** `routesToCompMap` will read through the config file and find the appropriate component
** file to import for that particular route. This map is then parsed below in the `renderRoutes`
** function, which will generate an array of Routes to be returned.
**
** You may use this format, or explicitly state your routes as done below for the '/logout' route.
**
*/
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
        <Route path="*" render={renderProps => {
          return (
            <div>
              <div>Sorry! Could not find the page you were looking for.</div>
              <Link to={config.routes.unauth.welcome}>Click here to get redirected back home.</Link>
            </div>
          );
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
          // TODO -- handle routing to unauth pages when logged in
          // for state persistence...
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