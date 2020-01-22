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
        Toast.fail('已经点过,不能在点!')
        return
      }
      if (res.suc) {
        props.getDataInit()
        return
      }
    })
  }
  return (
    <div key={props.rowID} style={{ padding: '0 15px' }}>
      <div className='messageBoard'>
        <div style={{ display: 'flex', height: '1rem', alignContent: 'center', justifyItems: 'center' }}>
          <div style={{ display: 'flex', width: '90%', alignContent: 'center', justifyItems: 'center' }}>
            <img src={props.rowData.avatar_url} alt="" />
            <p style={{ flex: 1 }}>{props.rowData.nickname}</p>
          </div>
          <div style={{
            width: '10%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i
              onClick={clickLike}
              className={props.rowData.user_fabulous !== 0 ? 'lovePress' : 'love'}
            />
            <p>{props.rowData.liked_num}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', paddingBottom: '15px' }} className='messageBoard'>
        <p style={{ backgroundColor: '#e6e3e3', borderRadius: '.15rem', padding: '.1rem' }}>{props.rowData.message}</p>
      </div>
    </div >
  )
}

export default ListContent
