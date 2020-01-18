import { initAxios } from '../utils/request'
// 用户反馈
export const getFeedBack = (params) => {
  return initAxios().post(`/v2/user/notice_add`, {
    ...params
  })
}
