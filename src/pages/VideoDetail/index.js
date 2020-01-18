// eslint-disable-next-line
import { Toast } from 'antd-mobile';
import DPlayer from 'dplayer';
import 'dplayer/dist/DPlayer.min.css';
import { createForm } from 'rc-form';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IsLogin from '../../components/login/index';
import PublicNavBar from '../../components/PublicNavBar';
import { getHotVideo, getVideoOnePatch } from '../../store/action/videoDetail';
import Content from './components/content';
import ModalPlayer from './components/ModalPlayer';
import './player.less';
const mapDispatchToProps = {
  getVideoOnePatch, getHotVideo
};

@connect(({ videoDetailReducer }) => ({
  videoDetailReducer
}), mapDispatchToProps)
@withRouter
@createForm()
class VideoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noLogin: false,
      detailData: {},
      navBarTitle: '',
      isLoading: false,
      visible: false,
      display: false,
      url: null,
      data: [
        { id: 1, title: '好看的视频,好看的视频', isCheck: false },
        { id: 2, title: '好看的视频,好看的视频', isCheck: false },
        { id: 3, title: '好看的视频,好看的视频', isCheck: false },
        { id: 4, title: '好看的视频,好看的视频', isCheck: false },
        { id: 5, title: '好看的视频,好看的视频', isCheck: false },
      ],
    }
  }

  componentDidMount() {
    this.getVideo()
    this.props.getHotVideo({ rows: '' })
    this.isLeave = false;
  }

  componentWillUnmount() {
    this.dPlayer && this.dPlayer.destroy();
    this.isLeave = true;
  }

  getVideo = (videoId = '') => {
    const { id } = this.props.match.params
    const user_id = sessionStorage.getItem('user_id')  //万能ID '9652'  sessionStorage.getItem('user_id')
    const video_id = id
    if (user_id === null) {
      this.setState({ noLogin: true })
    } else {
      this.setState({ noLogin: false })
      new Promise((resolve) => {
        this.props.getVideoOnePatch({ user_id, video_id: videoId === '' ? video_id : videoId, resolve })
      }).then(res => {
        if (res.video_url) {
          this.setState({
            navBarTitle: res.title.length >= 20 ? res.title.substring(0, 14).concat('...') : res.title,
            detailData: res
          })
          return this.InitDPlayer(res.video_url)
        }
        if (res.code === '-6') {
          Toast.fail(res.err)
           this.InitDPlayer('www.baidu.com')
           document.querySelector('.dplayer-full-icon').style.display='none'
        }

      })
    }
  }

  InitDPlayer = (url = '') => {
    if (this.dPlayer || this.isLeave) return;
    this.dp = new DPlayer({
      container: document.getElementById('dplayer'),
      lang: 'zh-cn',
      mutex: true,
      autoplay: true,
      loop: false,
      hotkey: true,
      preload: 'auto',
      volume: 0.7,
      video: {
        type: 'auto',
        url: url
      },
    });
  }

  onLeftClick = () => {
    this.props.history.push('/video')
  }
  showComment = () => {
    this.setState({
      visible: true
    })
  }

  closeLogin = () => {
    this.setState({ noLogin: false })
    window.location.reload()
  }

  render() {
    const { videoDetailReducer } = this.props;
    const { HotVideoList } = videoDetailReducer
    const navBarProps = {
      title: this.state.navBarTitle,
      isDetail: true,
      onLeftClick: this.onLeftClick,
      display: this.state.display
    }
    const modalProps = {
      visible: this.state.visible,
      onClose: () => this.setState({ visible: false }),
    }
    return (
      <div className='playerIndex'>
        <PublicNavBar  {...navBarProps} />
        <div onClick={() => this.setState({ display: !this.state.display })} id='dplayer' />
        <Content
          dataList={HotVideoList}
          router={this.props}
          getVideo={this.getVideo}
          detailData={this.state.detailData}
          showComment={this.showComment}
        />
        <div className='InpBottomSay'>
          <i className='iconPhoto' />
          <input onFocus={() => this.setState({ visible: true })} placeholder='我来说两句...' type="text" />
        </div>
        <ModalPlayer {...modalProps} />
        {this.state.noLogin ? <IsLogin rightCallBack={this.closeLogin} /> : null}
      </div>
    )
  }
}
export default VideoDetail
