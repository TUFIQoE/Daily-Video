import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk"
import userReducer from "./reducers";
import videoReducer from "./reducers/videoReducer";


const rootReducer = combineReducers({
    userReducer,
    videoReducer
})

export const Store = createStore(rootReducer, applyMiddleware(thunk))

