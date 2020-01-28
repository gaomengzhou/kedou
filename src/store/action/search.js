// import { Toast } from 'antd-mobile';
import { searchBook, searchVideo } from '../../services/search';
import { GET_SEARCH_BOOK, GET_SEARCH_VIDEO } from '../actionType';

//视频搜索
export const getSearchVideo = (params) => (dispatch) => {
  const { resolve } = params;
  return searchVideo(params).then(res => {
    if (res) {
      const data = res;
      resolve(res)
      dispatch({
        type: GET_SEARCH_VIDEO,
        data
      });
      return res
    }
  })
}

//听书搜索
export const getSearchBook = (params) => (dispatch) => {
  const { resolve } = params;
  return searchBook(params).then(res => {
    if (res) {
      const data = res
      resolve(res)
      dispatch({
        type: GET_SEARCH_BOOK,
        data
      });
      return res
    }
  })
}
