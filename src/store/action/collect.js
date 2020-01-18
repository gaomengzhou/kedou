// import { Toast } from 'antd-mobile';
import { BookCollectApi, delBoolCollectApi } from '../../services/collect';
// import { GET_BOOL_COLLECT } from '../actionType';


//用户收藏听书记录
export const getBookCollect = (params) => (dispatch) => {
  return BookCollectApi(params).then(res => {
    const { resolve } = params;
    if (res) {
      const data = res.map(item => {
        return {
          ...item,
          isCheck: false
        }
      });
      resolve(data)
      // dispatch({
      //   type: GET_BOOL_COLLECT,
      //   bookCollectList:res
      // })
    }
  })
}

//删除听书收藏记录
export const delBoolCollect = (params) => (dispatch) => {
  const { resolve } = params;
  return delBoolCollectApi(params).then(res => {
    if(res.suc){
      resolve(res)
    }
  })
}
