// import { Toast } from 'antd-mobile';
import { getHotVideos, getVideoOne } from '../../services/videoDetail';
import { GET_HOT_VIDEO } from '../actionType';

//视频详情
export const getVideoOnePatch = (params) => (dispatch) => {
  const { resolve } = params
  return getVideoOne(params).then(res => {
    if (res) {
      resolve(res)
    } else {
      resolve(res)
    }
  })
}


//视频详情页的热门视频
export const getHotVideo = (params) => (dispatch) => {
  return getHotVideos(params).then(res => {
    if (res) {
      const data = res.most;
      dispatch({
        type: GET_HOT_VIDEO,
        data
      })
    }
  })
}
