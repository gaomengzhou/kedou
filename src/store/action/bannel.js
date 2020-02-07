/**
 * 首页bannel相关
 */
import * as bannel from '../../services/bannel'
import * as actionType from '../actionType'
export const bannel_list = ({
    ...parameter
}) => (dispatch) => {
    return bannel.bannel_list({
        ...parameter
    }).then(res => {
        dispatch({
            type: actionType.BANNEL_LIST,
            bannelList: res
        })
    })
}