import * as actionType from '../actionType'
const videoReducer = (state = {}, action) => {
  switch (action.type) {
    case actionType.HOME_LIST: {
      return {
        ...state,
        newVideoList: action.newVideoList,
        hotVideoList: action.hotVideoList
      };
    }
    case actionType.LABEL_LIST: {
      return {
        ...state,
        labelList: action.labelList,
        recommend: action.recommend,
        hotLabel: action.hotLabel
      }
    }
    case actionType.TAB_LIST:{
      return{
        ...state,
        tabList:action.tabList
      }
    }
    default: {
      return state;
    }
  }
};

export default videoReducer;