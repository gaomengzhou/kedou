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
import { commentLikeApi } from '../../services/videoDetail';
import { getChat, getVideoOnePatch } from '../../store/action/videoDetail';
import Content from './components/content';
import ModalPlayer from './components/ModalPlayer';
import './player.less';

let setTimer;
let timeCount = 0;

const mapDispatchToProps = {
  getVideoOnePatch, getChat
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
      showControl: false,//是否显示播放条
      isCollect: false,//是否收藏了
      isReload: false,//判断是否应该刷新
      message: '',//留言的内容
      noLogin: false,
      detailData: {},
      navBarTitle: '',
      isLoading: false,
      visible: false,
      display: false,
      isLiked: false,
    }
  }

  componentDidMount() {
    const user_id = sessionStorage.getItem('user_id')
    this.getVideo()
    this.getChat()
    this.isLeave = false;
    if (user_id) {
      this.timer = setTimeout(() => {
        let dplayer = document.getElementById('dplayer')
        dplayer.classList.add('dplayer-hide-controller')
        document.querySelector('.dplayer-controller').addEventListener('click', function (e) {
          e.stopPropagation()
        })
        this.setState({
          display: true,
          showControl: true
        })
      }, 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    this.dPlayer && this.dPlayer.destroy();
    this.isLeave = true;
    clearInterval(setTimer)
  }

  getChat = (vId = '') => {
    const { id } = this.props.match.params
    this.props.getChat({
      user_id: sessionStorage.getItem('user_id'),
      video_id: vId === '' ? id.split('&')[0] : String(vId),
      page: '1',
      rows: '10'
    })
  }

  getVideo = (videoId = '') => {
    const { id } = this.props.match.params
    const user_id = sessionStorage.getItem('user_id')  //万能ID '9652'  sessionStorage.getItem('user_id')
    const video_id = id.split('&')[0]
    if (user_id === null) {
      this.setState({ noLogin: true })
    } else {
      this.setState({ noLogin: false })
      new Promise((resolve) => {
        this.props.getVideoOnePatch({ user_id, video_id: videoId === '' ? video_id : videoId, resolve })
      }).then(res => {
        if (res.user_fabulous === 0) {
          this.setState({
            isCollect: false
          })
        } else {
          this.setState({
            isCollect: true
          })
        }
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
          document.querySelector('.dplayer-full-icon').style.display = 'none'
        }
      })
    }
  }

  InitDPlayer = (url = '') => {
    const user_id = sessionStorage.getItem('user_id')
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
    if (user_id) {
      document.querySelector('.dplayer-controller').addEventListener('click', function (e) {
        e.stopPropagation();
        timeCount = 0;
      })
    }
  }

  onLeftClick = () => {
    if (sessionStorage.getItem('goBack')) {
      this.props.history.go(-1)
    } else {
      this.props.history.push('/video')
    }
  }
  bodyScroll = (e) => { e.preventDefault(); }

  showComment = () => {
    console.log(this.refs.dplayer)
    document.getElementById('dplayer').addEventListener('touchmove', this.bodyScroll, { passive: false })
    const height = document.getElementById('dplayer').offsetHeight
    document.documentElement.scrollTop = height / 3
    if(this.visible){
      return
    }else{
      this.setState({
        visible: true,
      })
    }
  }

  closeLogin = () => {
    this.setState({ noLogin: false })
    window.location.reload()
  }

  likedClick = () => {
    const detailData2 = this.state.detailData
    const { id } = this.props.match.params
    const video_id = id.split('&')[0]
    commentLikeApi({
      user_id: sessionStorage.getItem('user_id'),
      video_id,
      type: '4'
    }).then(res => {
      if (res.err) {
        Toast.info('请勿重复点赞', 1)
        return
      } else {
        detailData2.fabulous_video = 1
        detailData2.liked_num++
        this.setState({
          detailData: detailData2,
        })
      }
    })
  }

  sendMsg = (e) => {
    const { id } = this.props.match.params
    const user_id = sessionStorage.getItem('user_id')  //万能ID '9652'  sessionStorage.getItem('user_id')
    const video_id = id.split('&')[0]
    if (e.keyCode === 13) {
      if (this.state.message !== '') {
        commentLikeApi({
          user_id,
          type: '2',
          video_id,
          message: this.state.message
        }).then(res => {
          if (res.suc) {
            Toast.success(res.suc)
            this.setState({
              message: '',
              isReload: true
            })
          }
        })
      } else {
        return
      }
    }
  }

  cb = () => { // 提交评论后停止重复请求,以及在前台页面模拟数据变化减少数据请求,实际上后台以更新.
    const detailData = this.state.detailData
    detailData.comment_num++
    this.setState({
      isReload: false,
      detailData
    })
  }

  saveMsg = (e) => {
    this.setState({ message: e.target.value })
  }

  collectBtn = () => {
    const { id } = this.props.match.params
    commentLikeApi({
      user_id: sessionStorage.getItem('user_id'),
      video_id: id.split('&')[0],
      type: '1'
    }).then(res => {
      switch (res.suc) {
        case '收藏成功':
          this.setState({ isCollect: true })
          Toast.success(res.suc, 1, false)
          break;
        case '取消成功':
          this.setState({ isCollect: false })
          Toast.success(res.suc, 1, false)
          break;
        default:
          Toast.success('网络延迟,稍后在试')
          return
      }
    })
  }

  setTimerFN = () => {
    setTimer = setInterval(() => {
      timeCount++
      // console.log(timeCount)
      if (timeCount === 5) {
        document.getElementById('dplayer').classList.add('dplayer-hide-controller')
        this.setState({
          display: true,
          showControl: true
        })
        clearInterval(setTimer);
        timeCount = 0
      }
    }, 1000);
  }

  controlView = () => {
    clearTimeout(this.timer)
    this.setState({
      display: !this.state.display,
      showControl: !this.state.showControl
    })
    if (!this.state.showControl) {
      this.setState({
        showControl: true
      });
      let dplayer = document.getElementById('dplayer');
      dplayer.classList.add('dplayer-hide-controller');
      clearInterval(setTimer);
      timeCount = 0;
    } else {
      this.setState({
        showControl: false
      })
      let dplayer = document.getElementById('dplayer')
      dplayer.classList.remove('dplayer-hide-controller')
      this.setTimerFN()
    }
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
    const contentProps = {
      likedClick: this.likedClick,
      isLiked: this.state.isLiked,
      isCollect: this.state.isCollect,
      dataList: HotVideoList,
      router: this.props,
      getVideo: this.getVideo,
      getChat: this.getChat,
      detailData: this.state.detailData,
      showComment: this.showComment,
      collectBtn: this.collectBtn,
    }
    const modalProps = {
      cb: this.cb,
      commentNum: this.state.detailData.comment_num,
      visible: this.state.visible,
      onClose: () => {
        document.documentElement.scrollTop = 0;
        document.removeEventListener('touchmove', this.bodyScroll, { passive: false });
        this.setState({ visible: false })
      },
      dataSource: this.props.videoDetailReducer.comment,
      getChat: this.getChat,
      detailData: this.state.detailData,
      isReload: this.state.isReload
    }
    return (
      <div className='playerIndex'>
        <PublicNavBar  {...navBarProps} />
        <div id='dplayer' onClick={this.controlView} />
        <Content {...contentProps} />
        <div className='InpBottomSay'>
          <i className='iconPhoto' />
          <textarea
            onChange={this.saveMsg}
            onKeyDown={this.sendMsg}
            onFocus={this.showComment}
            placeholder='我来说两句...'
            type="text"
            value={this.state.message}
          />
        </div>
        <ModalPlayer {...modalProps} />
        {this.state.noLogin ? <IsLogin rightCallBack={this.closeLogin} /> : null}
      </div>
    )
  }
}
export default VideoDetail
