import * as actionType from '../actionType'
const bookReducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.BOOK_TAB_LIST: {
      return {
        ...state,
        tabList: action.tabList
      };
    }
    case actionType.REFRESH:{
      return {
        ...state,
        refresh: action.refresh
      };
    }
    default: {
      return state;
    }
  }
};

export default bookReducer;