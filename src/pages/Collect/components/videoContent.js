import { Checkbox, ListView } from 'antd-mobile';
import PropTypes from 'prop-types';
import React from 'react';
import ImgLoad from '../../../components/ImgActivityIndicator';
import '../style.less';

const VideoContent = (props) => {
  const onEndReached = (event) => {
    props.callBackStateVideo()
  }
  const CheckboxItem = Checkbox.CheckboxItem;

  const rows = (item, sectionID, index) => {
    return (
      props.isEdit ?
        <label key={item.id}>
          <CheckboxItem checked={item.isCheck ? true : false} onChange={(v) => props.selectOne2(v, index, item)}>
            <div className='collectContent'>
              <ImgLoad
                src={item.cover_one}
                width={'100%'}
                height={'78%'}
                top={'35%'}
                left={'25%'}
              />
              <p style={{ lineHeight: '.5rem' }}>{item.title}</p>
              {/* <span>昨天</span> */}
            </div>
          </CheckboxItem>
        </label> :
        <div key={item.id} className='collectContent' style={{ position: 'relative' }}>
          <ImgLoad
            onClick={() => props.goToVideo(item)}
            src={item.cover_one}
            width={'100%'}
            height={'78%'}
            top={'35%'}
            left={'25%'}
          />
          <p style={{ lineHeight: '.5rem' }}>{item.title}</p>
          {/* <span>昨天</span> */}
        </div>
    )
  };
  return (
    <ListView
      dataSource={props.dataSource}
      renderFooter={() => (
        <div style={{ marginTop: 20, marginBottom: props.isEdit ? 60 : 20, padding: 0, textAlign: 'center' }}>
          {props.dataSource._cachedRowCount > 9 ? props.isLoading ? '加载中...' : props.loadingText : ''}
        </div>
      )}
      renderRow={rows}
      className="am-list-video"
      pageSize={4}
      useBodyScroll
      scrollRenderAheadDistance={500}
      onEndReached={onEndReached}
      onEndReachedThreshold={10}
    />
  )
}

VideoContent.propTypes = {
  isEdit: PropTypes.bool,
  callBackStateVideo: PropTypes.func,
  selectOne2: PropTypes.func,
  goToVideo: PropTypes.func,
  dataSource: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
}

VideoContent.defaultProps = {
  isEdit: false,
  callBackStateVideo: () => console.log('没有传入callBackStateVideo这个props'),
  selectOne2: () => console.log('没有传入selectOne2这个props'),
  goToVideo: () => console.log('没有传入goToVideo这个props'),
  dataSource: [],
  isLoading: false,
  loadingText: '',
}
export default VideoContent
