import { ListView } from 'antd-mobile';
import PropTypes from 'prop-types';
import React from 'react';
import ImgLoad from '../../../components/ImgActivityIndicator';
import '../index.less';

const BookSearch = (props) => {
  const onEndReached = (event) => {
    props.onScrollData()
  }

  const row = (item, sectionID, rowID) => {
    return (
      <div key={item.id} className='searchContent'>
        <div className='searchContentOne' style={{ position: 'relative' }}>
          <ImgLoad
            onClick={() => props.goBook(item)}
            src={item.poster}
            width={'2.7rem'}
            height={'4rem'}
            top={'46%'}
            left={'7%'}
          />
          <div style={{ height: '4rem' }}>
            <div className='searchText'>
              <h1>{item.title}</h1>
              <div style={{ display: 'flex' }}>
                <p className='playerNum'>{item.play}</p>
                <p className='collectNum'>{item.love}</p>
              </div>
              <div style={{ display: 'flex', marginTop: '.3rem' }}>
                <p className='typeText1'>{item.label}</p>
                <p className='typeText2'>{'暂无'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <ListView
      dataSource={props.dataSource}
      renderFooter={() => (
        <div style={{ marginTop: 20, marginBottom: 20, padding: 0, textAlign: 'center' }}>
          {props.dataSource._cachedRowCount > 9 ? props.isLoading ? '加载中...' : props.loadingText : ''}
        </div>
      )}
      renderRow={row}
      className="am-list-search"
      pageSize={4}
      useBodyScroll
      // onScroll={() => { console.log('scroll'); }}
      scrollRenderAheadDistance={500}
      onEndReached={onEndReached}
      onEndReachedThreshold={10}
    />
  );
}

BookSearch.protoType = {
  onScrollData: PropTypes.func,
  goBook: PropTypes.func,
  dataSource: PropTypes.object,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
}

BookSearch.defaultProps = {
  onScrollData: () => console.log('没有传入onScrollData这个props'),
  goBook: () => console.log('没有传入goBook这个props'),
  dataSource: [],
  isLoading: false,
  loadingText: '',
}

export default BookSearch
