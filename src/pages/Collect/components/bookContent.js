import { Checkbox, ListView } from 'antd-mobile';
import React from 'react';
import '../style.less';

const BookContent = (props) => {
  const onEndReached = (event) => {
    // props.callBackStateBook()
  }
  const CheckboxItem = Checkbox.CheckboxItem;
  const row = (item, sectionID, index) => {
    return (
      props.isEdit ?
        <label key={item.novel_id}>
          <CheckboxItem checked={item.isCheck ? true : false} onChange={(v) => props.selectOne(v, index, item)}>
            <div className='collectContent'>
              <img style={{ width: '100%', height: '100%' }} src={item.poster} alt="" />
              <p>{item.title}</p>
              {/* <span>昨天</span> */}
            </div>
          </CheckboxItem>
        </label> :
        <div key={item.novel_id} className='collectContent'>
          <img onClick={() => props.goToBook(item)} style={{ width: '100%', height: '100%' }} src={item.poster} alt="" />
          <p>{item.title}</p>
          {/* <span>昨天</span> */}
        </div>
    )
  };
  return (
    <ListView
      dataSource={props.dataSourceBook}
      renderFooter={() => (<div style={{ padding: props.isEdit ? 20 : 0, textAlign: 'center', color: '#fff', background: '#fff' }}>
        {/* {props.isLoading ? '加载中...' : '没够更多了'} */}
        {/* {props.isLoading ? '加载中...' : props.loadingText} */}
      </div>)}
      renderRow={row}
      className="am-list-video"
      pageSize={4}
      useBodyScroll
      // onScroll={() => { console.log('scroll'); }}
      scrollRenderAheadDistance={500}
      onEndReached={onEndReached}
      onEndReachedThreshold={10}
    />
  )
}

export default BookContent
