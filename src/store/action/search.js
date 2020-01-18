// import { Toast } from 'antd-mobile';
import { searchBook, searchVideo } from '../../services/search';
import { GET_SEARCH_BOOK, GET_SEARCH_VIDEO } from '../actionType';

//视频搜索
export const getSearchVideo = (params) => (dispatch) => {
  return searchVideo(params).then(res => {
    if (res) {
      const data =res;
      console.log('data========',data)
      dispatch({
        type: GET_SEARCH_VIDEO,
        data
      })
    }
  })
}

//视频搜索
export const getSearchBook = (params) => (dispatch) => {
  return searchBook(params).then(res => {
    if (res) {
      const data =res.guess;
      console.log('data========',data)
      dispatch({
        type: GET_SEARCH_BOOK,
        data
      })
    }
  })
}
