import { ListView } from 'antd-mobile';
import React from 'react';
import '../index.less';

const VideoSearch = (props) => {
  const onEndReached = (event) => {
    props.onScrollData()
  }

  const row = (item, sectionID, rowID) => {
    return (
      <div key={item.id} className='searchContent'>
        <div className='searchContentOne'>
          <img onClick={() => props.goPlayer(item)} src={item.cover_one} alt="" />
          <div className='searchText'>
            <h1>{item.title}</h1>
            <div style={{ display: 'flex' }}>
              <p className='playerNum'>{item.play_num}</p>
              <p className='collectNum'>{item.most_like}</p>
            </div>
            <div style={{ display: 'flex', marginTop: '.3rem' }}>
              <p className='typeText1'>{item.class_name}</p>
              {
                item.label.split('|')[2]
                  ? <p className='typeText2'>{item.label.split('|')[2]}</p>
                  : <p className='typeText2'>{item.label.split('|')[0]}</p>
              }
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
          {props.dataSource._cachedRowCount >9 ? props.isLoading ? '加载中...' : props.loadingText : ''}
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
export default VideoSearch