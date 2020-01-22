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

//视频评论列表
export const getChatApi = (params) => {
  return initAxios().post('/v2/VideoInterface/video_comment', {
    ...params
  })
}


//评论、点赞评论、视频点赞、收藏、取消收藏
export const commentLikeApi = (params) => {
  return initAxios().post('/v2/VideoInterface/video_comment_add', {
    ...params
  })
}
