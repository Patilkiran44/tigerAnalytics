import { createStore, combineReducers } from 'redux';
import dataReducer from './redux/dataReducer';
const rootReducer = combineReducers(
{ data: dataReducer }
);
const configureStore = () => {
return createStore(rootReducer);
}
export default configureStore;