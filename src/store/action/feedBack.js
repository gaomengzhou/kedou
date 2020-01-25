import { getFeedBack } from '../../services/feedBack';

//用户反馈
export const userFeedBacks = (params) => (dispatch) => {
  return getFeedBack(params).then(res => {
    if (res) {
      return res
    }
  })
}
