import { initAxios } from '../utils/request'
// 用户收藏听书记录
export const BookCollectApi = (params) => {
  return initAxios().post(`/v2/novel/collect_list`, {
    ...params
  })
}

//视频搜藏记录
export const videoCollectApi = (params) => {
  return initAxios().post('/v2/VideoInterface/video_record', {
    ...params
  })
}

// 删除听书收藏记录
export const delBoolCollectApi = (params) => {
  return initAxios().post(`/v2/novel/collect_batch_cancel`, {
    ...params
  })
}
