import { compose, applyMiddleware, createStore } from 'redux';
import reducer from './reducers';
import defaultStore from './defaultStore';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const middlewares = [logger, thunk];

const finalCreateStore = compose(applyMiddleware(...middlewares))(createStore);

export default finalCreateStore(reducer, defaultStore);