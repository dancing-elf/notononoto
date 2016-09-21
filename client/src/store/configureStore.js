import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

/**
 * Create global Redux store
 * @param initialState initial state
 * @returns {Store} Redux store
 */
export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
}