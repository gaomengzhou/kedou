import * as actionType from '../actionType';
const searchReducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.GET_SEARCH_VIDEO: {
      return {
        ...state,
        data: action.data
      };
    }
    case actionType.GET_SEARCH_BOOK: {
      return {
        ...state,
        bookData: action.data
      };
    }

    default: {
      return state;
    }
  }
};

export default searchReducer;
