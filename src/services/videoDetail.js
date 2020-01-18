import { initAxios } from '../utils/request'
// 视频详情
export const getVideoOne = (params) => {
  return initAxios().post(`/v2/videoInterface/video_watch`, {
    ...params
  })
}

//视频详情里面的热门视频
export const getHotVideos = (params) => {
  return initAxios().post('/v2/video/video_list', {
    ...params
  })
}
