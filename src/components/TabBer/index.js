import { TabBar } from 'antd-mobile';
import React from 'react';
import { withRouter } from 'react-router-dom';
@withRouter
class TabBarExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '1',
      hidden: false,
      fullScreen: true,
    };
  }
  componentDidMount() {
  }


  render() {
    let url = this.props.location.pathname.split('/')
    let showNav = /^(video|book)$/.test(url[1])
    return <>
      {showNav && <div className='TabBer' style={this.state.fullScreen ? { position: 'fixed', bottom: '0', width: '100%', zIndex: '10001',transition:'1s' } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            icon={{ uri: require('../../assets/images/video_nomal.png') }}
            selectedIcon={{ uri: require('../../assets/images/video_pressed.png') }}
            title="视频"
            key="视频"
            selected={url[1] === 'video' ? true : false}
            onPress={() => {
              if (url[1] !== 'video') {
                this.props.history.push('/video')
              }
            }}
          />
          <TabBar.Item
            icon={{ uri: require('../../assets/images/book_nomal.png') }}
            selectedIcon={{ uri: require('../../assets/images/book_pressed.png') }}
            title="听书"
            key="听书"
            selected={url[1] === 'book' ? true : false}
            onPress={() => {
              if (url[1]!== 'book') {
                this.props.history.push('/book')
              }
            }}
          />
        </TabBar>
      </div>
      }
    </>
  }
}
export default TabBarExample
