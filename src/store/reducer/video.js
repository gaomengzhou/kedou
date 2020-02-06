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
    case actionType.CHANGE_TAB:{
      return{
        ...state,
        tabAction:action.tabAction,
      }
    }
    case actionType.SCROLL_TOP:{
      return{
        ...state,
        scrollTop:action.scrollTop
      }
    }
    case actionType.GO_BACK_LIST:{
      return{
        ...state,
        goBackList:action.goBackList
      }
    }
    default: {
      return state;
    }
  }
};

export default videoReducer;