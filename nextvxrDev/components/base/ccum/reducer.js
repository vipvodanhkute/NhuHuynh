const dataDefault = [];

const dataReducer = (state = dataDefault, action) => {
  if (action.type === 'dataCCUM') return [...action.data] 
  return state;
}
export default dataReducer

   // if(action.type==='getApiChamp') return [...action.data]; 
