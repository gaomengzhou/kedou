// import { Toast } from 'antd-mobile';
import { getChatApi, getVideoOne } from '../../services/videoDetail';
import { GET_HOT_VIDEO } from '../actionType';

//视频详情页评论及猜你喜欢
export const getChat = (params) => (dispatch) => {
  return getChatApi(params).then(res => {
    if (res) {
      const data = res.video
      const comment = res.comment
      dispatch({
        type: GET_HOT_VIDEO,
        data,
        comment
      })
    }
  })
}

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
// export const getHotVideo = (params) => (dispatch) => {
//   return getHotVideos(params).then(res => {
//     if (res) {
//       const data = res.most;
//       dispatch({
//         type: GET_HOT_VIDEO,
//         data
//       })
//     }
//   })
// }
