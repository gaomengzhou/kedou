import { Toast } from 'antd-mobile';
import React from 'react';
import { commentLikeApi } from '../../../services/videoDetail';
const ListContent = (props) => {

  const clickLike = () => {
    commentLikeApi({
      user_id: sessionStorage.getItem('user_id'),
      type: '3',
      comment_id: props.rowData.id
    }).then(res => {
      if (res.err) {
        Toast.fail('已经点过,不能再点!')
        return
      }
      if (res.suc) {
        props.getDataInit()
        return
      }
    })
  }
  return (
    <div className='msg-body' key={props.rowID} style={{ padding: '0 15px' }}>
      <div className='messageBoard'>
        <div style={{ display: 'flex', height: '1rem', alignContent: 'center', justifyItems: 'center' }}>
          <div style={{ display: 'flex', width: '90%', alignContent: 'center', justifyItems: 'center' }}>
            <img src={props.rowData.avatar_url} alt="" />
            <p style={{ flex: 1 }}>{props.rowData.nickname}</p>
          </div>
          <div>
            <i
              onClick={clickLike}
              className={props.rowData.user_fabulous !== 0 ? 'lovePress' : 'love'}
            />
            <p>{props.rowData.liked_num}</p>
          </div>
        </div>
      </div>
      <div className='messageBoards'>
        <p className='msgData'>{props.rowData.message}</p>
      </div>
    </div >
  )
}

export default ListContent
