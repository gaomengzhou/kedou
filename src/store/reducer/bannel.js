import * as actionType from '../actionType'
const bannel = (state = {}, action) => {
    switch (action.type) {
      case actionType.BANNEL_LIST: {
        return {
          ...state,
          bannelList: action.bannelList
        };
      }
      default: {
        return state;
      }
    }
  };
  
  export default bannel;