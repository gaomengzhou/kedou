import { initAxios } from '../utils/request'
// 用户反馈
export const getFeedBack = (params) => {
  return initAxios().post(`/v2/user/notice_add`, {
    ...params
  })
}


// 获取反馈联系方式
export const contactApi = (params) => {
  return initAxios().post('/v2/common/contact_list', {
    ...params
  })
}
