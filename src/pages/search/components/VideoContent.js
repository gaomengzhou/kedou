import { ListView } from 'antd-mobile';
import React from 'react';
import '../index.less';

const VideoSearch = (props) => {
  const onEndReached = (event) => {
    props.onScrollVideoData()
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
              {/* <p className='collectNum'>40504</p> */}
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
      // renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
      //   {state.isLoading ? 'Loading...' : 'Loaded'}
      // </div>)}
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
