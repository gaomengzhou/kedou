import * as actionType from '../actionType'
const bookReducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.BOOK_TAB_LIST: {
        console.log(action);
      return {
        ...state,
        tabList: action.tabList
      };
    }
    
    default: {
      return state;
    }
  }
};

export default bookReducer;