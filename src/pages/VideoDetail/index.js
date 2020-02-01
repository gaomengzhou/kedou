// eslint-disable-next-line
import { Modal, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
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
import MyListView from './components/ViewList';
import './player.less';

let setTimer = null;
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
      paramsId: '',
      comment_num: '',
      anchor: true,
      closed: false,
      theOne: true,
    }
  }

  componentDidMount() {
    this.setState({
      paramsId: this.props.match.params.id,
      innerHeight: window.innerHeight
    })
    document.documentElement.scrollTop = 0
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getVideo(this.props.match.params.id)
      this.getChat()
    }
  }


  componentWillUnmount() {
    clearTimeout(this.timer)
    clearTimeout(this.setToast)
    clearTimeout(this.shareTimeOut)
    clearInterval(setTimer)
    this.dPlayer && this.dPlayer.destroy();
    this.isLeave = true;
    document.querySelector('.dplayer-controller').removeEventListener('click', function (e) {
      e.stopPropagation()
    })
  }

  getChat = (vId = '') => {
    const { id } = this.props.match.params
    this.props.getChat({
      user_id: sessionStorage.getItem('user_id'),
      video_id: vId === '' ? id : String(vId),
      page: '1',
      rows: '10'
    })
  }
  toShare = (res) => {
    if (res.result) {
      copy(res.share_url)
      Toast.success('邀请码链接复制成功,粘贴给好友注册吧!', 3)
      this.shareTimeOut = setTimeout(() => {
        this.props.history.push('/video')
      }, 3000);
    } else {
      Toast.success('网络延迟稍后再试')
    }
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
        this.props.getVideoOnePatch({ user_id, video_id: String(videoId) === '' ? video_id : String(videoId), resolve })
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
          const { comment_num } = res
          this.setState({
            navBarTitle: res.title.length >= 20 ? res.title.substring(0, 14).concat('...') : res.title,
            detailData: res,
            comment_num
          })
          this.InitDPlayer(res.video_url)
        }
        if (res.code === -6) {
          this.InitDPlayer(' ')
          document.querySelector('.dplayer-full-icon').style.display = 'none';
          this.setState({
            dpHeight: 0
          });
          Modal.alert(res.err, '邀请用户可提升观看次数', [
            { text: '回首页', onPress: () => this.props.history.push('/video') },
            { text: '去邀请', onPress: () => this.toShare(res) },
          ])
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

  showComment2 = (anchorName) => {
    this.setState({
      closed: false
    })
    const contentHeight = document.getElementById('contentPlayer').offsetHeight;
    const dpHeight = document.getElementById('dplayer').offsetHeight;
    document.documentElement.scrollTop = contentHeight + dpHeight;
  }

  closeLogin = () => {
    this.setState({ noLogin: false })
    window.location.reload()
  }

  likedClick = () => {
    const { id } = this.props.match.params
    const video_id = id
    commentLikeApi({
      user_id: sessionStorage.getItem('user_id'),
      video_id,
      type: '4'
    }).then(res => {
      if (res.err) {
        Toast.info('请勿重复点赞', 1)
        return
      }
    })
  }

  sendMsg = (e) => {
    const { id } = this.props.match.params
    const user_id = sessionStorage.getItem('user_id')  //万能ID '9652'  sessionStorage.getItem('user_id')
    const video_id = id
    setTimeout(() => {
      const contentHeight = document.getElementById('contentPlayer').offsetHeight;
      const dpHeight = document.getElementById('dplayer').offsetHeight;
      document.documentElement.scrollTop = contentHeight + dpHeight;
    }, 350);
    this.setState({
      closed: false
    })
    if (this.state.message !== '') {
      this.setState({
        message: '',
      })
      commentLikeApi({
        user_id,
        type: '2',
        video_id,
        message: this.state.message
      }).then(res => {
        if (res.suc) {
          Toast.success(res.suc)
          this.setState({
            isReload: true,
            comment_num: this.state.comment_num + 1,
            hiddenFootDiv: true
          });
        }
      })
    }
  }

  cb = () => {
    this.setState({
      isReload: false,
    });
  }

  saveMsg = (e) => {
    this.setState({ message: e.target.value })
  }

  collectBtn = () => {
    const { id } = this.props.match.params
    commentLikeApi({
      user_id: sessionStorage.getItem('user_id'),
      video_id: id,
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

  showComment = (anchorName) => {
    this.setState({
      closed: false
    })
    setTimeout(() => {
      this.setState({
        closed: true
      })
    }, 1000);
    if (this.state.theOne) {
      this.setState({
        theOne: false
      })
      setTimeout(() => {
        const contentHeight = document.getElementById('contentPlayer').offsetHeight;
        const dpHeight = document.getElementById('dplayer').offsetHeight;
        document.documentElement.scrollTop = contentHeight + dpHeight;
      }, 320);
    } else {
      setTimeout(() => {
        document.documentElement.scrollTop = 0
      }, 300);
      setTimeout(() => {
        const contentHeight = document.getElementById('contentPlayer').offsetHeight;
        const dpHeight = document.getElementById('dplayer').offsetHeight;
        document.documentElement.scrollTop = contentHeight + dpHeight;
      }, 320);
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
      comment_num: this.state.comment_num,
      showComment2: this.showComment2,
      collectBtn: this.collectBtn,
      cb: this.cb,
      isReload: this.state.isReload,
      dataSource: this.props.videoDetailReducer.comment,
    }
    const myListViewProps = {
      cb: this.cb,
      cbClosed: () => this.setState({
        closed: false
      }),
      commentNum: this.state.detailData.comment_num,
      dataSource: this.props.videoDetailReducer.comment,
      getChat: this.getChat,
      detailData: this.state.detailData,
      isReload: this.state.isReload,
      closed: this.state.closed,
    }
    return (
      <div className='playerIndex'>
        <PublicNavBar  {...navBarProps} />
        <div
          id='dplayer'
          onClick={this.controlView}
          style={{ width: '100%' }}
        />
        <Content {...contentProps} />
        <div className='InpBottomSay'>
          <i className='iconPhoto' />
          <textarea
            id='textareaIput'
            onChange={this.saveMsg}
            onFocus={() => this.showComment('anchor')}
            placeholder='我来说两句...'
            type="text"
            value={this.state.message}
          />
          <p style={{
            color: '#fff',
            borderLeft: '1px solid #fff',
            fontSize: '.3rem',
            paddingLeft: '.1rem',
            fontWeight: 'bolder'
          }}
            onClick={this.sendMsg}
          >发送</p>
        </div>
        <p id='anchor' style={{ marginLeft: '.1rem' }} className='hotComment'>热门评论{`（${this.state.comment_num}）`}</p>
        <MyListView {...myListViewProps} />
        {this.state.noLogin ? <IsLogin rightCallBack={this.closeLogin} /> : null}
      </div>
    )
  }
}
export default VideoDetail
