import { initAxios } from '../utils/request'
// 视频搜索
export const searchVideo = (params) => {
  return initAxios().post(`/v2/VideoInterface/search_video`, {
    ...params
  })
}

// 听书搜索
export const searchBook = (params) => {
  return initAxios().post(`/v2/novel/search`, {
    ...params
  })
}
