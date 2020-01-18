import { Toast } from 'antd-mobile';
import { getFeedBack } from '../../services/feedBack';
import { GET_FEED_BACK } from '../actionType';


//用户反馈
export const userFeedBacks = (params) => (dispatch) => {
  return getFeedBack(params).then(res => {
    if (res) {
      Toast.success(res.suc)
      dispatch({
        type: GET_FEED_BACK,
      })
    }
  })
}
