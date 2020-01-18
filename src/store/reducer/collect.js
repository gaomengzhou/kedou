import * as actionType from '../actionType';
const userCollect = (state = {}, action) => {
  switch (action.type) {
    case actionType.GET_BOOL_COLLECT: {
      return {
        ...state,
        bookCollectList: action.bookCollectList
      };
    }

    default: {
      return state;
    }
  }
};

export default userCollect;
