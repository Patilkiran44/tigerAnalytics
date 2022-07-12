import  {DATA_CHANGE}  from './constant';
export function changeData(data) {
return {
type: DATA_CHANGE,
payload: data
}
}

