import * as actionType from '../actionType';
const videoDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.GETONEVIDEO: {
      return {
        ...state,
        data: action.data
      };
    }

    case actionType.GET_HOT_VIDEO: {
      return {
        ...state,
        HotVideoList: action.data
      }
    }

    default: {
      return state;
    }
  }
};

export default videoDetailReducer;
