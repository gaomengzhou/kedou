import { Checkbox, ListView } from 'antd-mobile';
import React from 'react';
import ImgLoad from '../../../components/ImgActivityIndicator';
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
            <div className='collectContentBook'>
              <ImgLoad
                src={item.poster}
                width={'100%'}
                height={'92%'}
                top={'45%'}
                left={'25%'}
              />
              <p style={{ lineHeight: '.5rem' }}>{item.title}</p>
              {/* <span>昨天</span> */}
            </div>
          </CheckboxItem>
        </label> :
        <div key={item.novel_id} className='collectContentBook' style={{ position: 'relative' }}>
          <ImgLoad
            onClick={() => props.goToBook(item)}
            src={item.poster}
            width={'100%'}
            height={'92%'}
            top={'45%'}
            left={'25%'}
          />
          <p style={{ lineHeight: '.5rem' }}>{item.title}</p>
          {/* <span>昨天</span> */}
        </div>
    )
  };
  return (
    <ListView
      dataSource={props.dataSourceBook}
      renderFooter={() => (
        <div style={{ marginTop: 20, marginBottom: props.isEdit ? 60 : 20, padding: 0, textAlign: 'center' }}>
          {props.dataSourceBook._cachedRowCount > 4 ? '没有更多了' : ''}
          {/* {props.dataSourceBook._cachedRowCount>=10?props.isLoading ? '加载中...' : props.loadingText:''} */}
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
