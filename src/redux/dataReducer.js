import { DATA_CHANGE } from './constant';
const initialState = {
data: 0
};
const dataReducer = (state = initialState, action) => {
switch(action.type) {
case DATA_CHANGE:
return {
...state,
data:action.payload
};
default:
return state;
}
}
export default dataReducer;
