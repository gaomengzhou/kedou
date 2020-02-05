import { Button, ListView } from 'antd-mobile';
import 'dplayer/dist/DPlayer.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PublicNavBar from '../../components/PublicNavBar';
import { delBoolCollect, delVideo, getBookCollect, getVideoCollect } from '../../store/action/collect';
import BookContent from './components/bookContent.js';
import TabExample from './components/tabs';
import VideoContent from './components/videoContent';
import './style.less';

const mapDispatchToProps = {
  getBookCollect,
  delVideo,
  getVideoCollect,
  delBoolCollect
};

@connect(({ userCollect }) => ({
  userCollect
}), mapDispatchToProps)
class Collect extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const dataSourceBook = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      isShow: true, // 根据值判断是否显示带有loading的foot
      loadingText: '加载完成', //ListView 脚步的文案
      videoPage: 1, // 请求的page参数
      bookPage: 1, // 请求的page参数
      isLoading: true, //根据这个字段来决定上拉加载脚步的文案
      isStop: false, // 视频是否继续请求
      isStopBook: false, // 听书是否继续请求
      dataSourceBook, // 听书ListView数据源
      dataSource, // 视频ListView数据源
      user_id: '', // 用户id 请求的user_id参数
      ids: '',//听书id 请求的ids参数
      isEdit: false, // 头部是否显示编辑按钮
      checkedStatus: false, //全选为true
      page: 0,//根据tabs页面决定全选哪个版块内容
      count: 0,//选中了几个
      bookCollectList: [],//听书收藏数据
      videoCollectList: [],//视频收藏数据
    }
  }

  componentDidMount() {
    new Promise(resolve => {
      this.props.getBookCollect({
        user_id: sessionStorage.getItem('user_id'),
        resolve,
        rows: '10',
        page: '1',
      })
    }).then(res => {
      this.setState({
        bookCollectList: res,
        dataSourceBook: this.state.dataSourceBook.cloneWithRows(res),
        isLoading: false,
      })
    });

    new Promise(resolve => {
      this.props.getVideoCollect({
        user_id: sessionStorage.getItem('user_id'),
        type: '2',
        resolve,
        rows: '10',
        page: '1',
      })
    }).then(res => {
      if (res.length === 0) {
        this.setState({
          isShow: false,
        })
      } else if (res.length < 10) {
        this.setState({
          isStop: true,
          isShow: true,
          videoCollectList: res,
          dataSource: this.state.dataSource.cloneWithRows(res),
          isLoading: false,
        })
      } else {
        this.setState({
          isShow: true,
          videoCollectList: res,
          dataSource: this.state.dataSource.cloneWithRows(res),
          isLoading: false,
        })
      }
    })
  }

  deleteBtn = () => {
    this.setState({
      checkedStatus: false
    })
    if (this.state.page === 1) {
      if (this.state.ids === '') {
        return
      } else {
        new Promise(resolve => {
          this.props.delBoolCollect({
            ids: this.state.ids,
            user_id: sessionStorage.getItem('user_id'),
            resolve
          })
        }).then(res => {
          if (res.suc) {
            new Promise(resolve => {
              this.props.getBookCollect({ user_id: sessionStorage.getItem('user_id'), resolve })
            }).then(res => {
              if (res.length === 0) {
                this.setState({
                  isEdit: false
                })
              }
              this.setState({
                bookCollectList: res,
                dataSourceBook: this.state.dataSourceBook.cloneWithRows(res),
                count: 0,
                ids: '',
              })
            })
          }
        })
      }
    } else {
      if (this.state.ids === '') {
        return
      } else {
        new Promise(resolve => {
          this.props.delVideo({
            ids: this.state.ids,
            user_id: sessionStorage.getItem('user_id'),
            resolve
          })
        }).then(res => {
          if (res.suc) {
            new Promise(resolve => {
              this.props.getVideoCollect({
                user_id: sessionStorage.getItem('user_id'),
                type: '2',
                resolve,
                rows: '10',
                page: '1',
              })
            }).then(res => {
              if (res.length === 0) {
                this.setState({
                  isEdit: false
                })
              }
              this.setState({
                videoCollectList: res,
                dataSource: this.state.dataSource.cloneWithRows(res),
                count: 0,
                videoPage: 1,
                ids: '',
                isStop: false,
              })
            })
          }
        })
      }
    }
  }

  onLeftClick = () => {
    this.props.history.go(-1)
  }
  // 编辑按钮
  onRightClick = () => {
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    const data2 = JSON.parse(JSON.stringify(this.state.videoCollectList))

    this.state.bookCollectList.forEach((item, index, arr) => {
      data[index].isCheck = false
    })
    this.state.videoCollectList.forEach((item, index, arr) => {
      data2[index].isCheck = false
    })
    this.setState({
      isEdit: !this.state.isEdit,
      count: 0,
      checkedStatus: false,
      bookCollectList: data,
      videoCollectList: data2,
      dataSourceBook: this.state.dataSourceBook.cloneWithRows(data),
      dataSource: this.state.dataSource.cloneWithRows(data2),
      ids: '',
    });
  }
  //切换Tab取消勾选的项目
  onTabChange = (v, i) => {
    document.body.scrollTop=document.documentElement.scrollTop = 0
    this.setState({ page: i })
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    const data2 = JSON.parse(JSON.stringify(this.state.videoCollectList))
    this.state.bookCollectList.forEach((item, index, arr) => {
      data[index].isCheck = false
    })
    this.state.videoCollectList.forEach((item, index, arr) => {
      data2[index].isCheck = false
    })
    this.setState({
      checkedStatus: false,
      bookCollectList: data,
      videoCollectList: data2,
      dataSource: this.state.dataSource.cloneWithRows(data2),
      dataSourceBook: this.state.dataSourceBook.cloneWithRows(data),
      count: 0,
      ids: '',
      isLoading: false
    })
  }
  //全选
  selectAll = () => {
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    const data2 = JSON.parse(JSON.stringify(this.state.videoCollectList))
    const checkedStatus = this.state.checkedStatus
    if (this.state.page === 0) {//视频
      const ids = data2.map(item => item.video_id)
      if (!this.state.checkedStatus) {
        this.state.videoCollectList.forEach((item, index, arr) => {
          data2[index].isCheck = !checkedStatus
        })
        this.setState({
          checkedStatus: !checkedStatus,
          videoCollectList: data2,
          dataSource: this.state.dataSource.cloneWithRows(data2),
          count: data2.length,
          ids: ids.join(',')
        })
      } else {
        this.state.videoCollectList.forEach((item, index, arr) => {
          data2[index].isCheck = !checkedStatus
        })
        this.setState({
          checkedStatus: !checkedStatus,
          videoCollectList: data2,
          dataSource: this.state.dataSource.cloneWithRows(data2),
          count: 0,
          ids: '',
        })
      }
    } else {//听书
      if (!this.state.checkedStatus) {
        this.state.bookCollectList.forEach((item, index, arr) => {
          data[index].isCheck = !checkedStatus
        })
        const ids = data.map(item => item.novel_id)
        this.setState({
          checkedStatus: !checkedStatus,
          bookCollectList: data,
          dataSourceBook: this.state.dataSourceBook.cloneWithRows(data),
          count: data.length,
          ids: ids.join(',')
        })
      } else {
        this.state.bookCollectList.forEach((item, index, arr) => {
          data[index].isCheck = !checkedStatus
        })
        this.setState({
          checkedStatus: !checkedStatus,
          bookCollectList: data,
          dataSourceBook: this.state.dataSourceBook.cloneWithRows(data),
          count: 0,
          ids: ''
        })
      }
    }
  }
  //听书单选
  selectOne = (e, index, item) => {
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    data[index].isCheck = e.target.checked
    const deleteData = data.filter(val => val.isCheck === true)
    const ids = deleteData.map(val => val.novel_id)
    const flag = data.filter(val => val.isCheck === false)
    if (flag.length === 0) {
      this.setState({ checkedStatus: true })
    } else {
      this.setState({ checkedStatus: false })
    }
    this.setState({
      bookCollectList: data,
      dataSourceBook: this.state.dataSourceBook.cloneWithRows(data),
      ids: ids.join(',')
    });
    if (item.isCheck) {
      this.setState({ count: this.state.count - 1 })
    } else {
      this.setState({ count: this.state.count + 1 })
    }
  }
  //视频单选
  selectOne2 = (e, index, item) => {
    const data = JSON.parse(JSON.stringify(this.state.videoCollectList))
    data[index].isCheck = e.target.checked
    const deleteData = data.filter(val => val.isCheck === true)
    const ids = deleteData.map(val => val.video_id)
    const flag = data.filter(val => val.isCheck === false)
    if (flag.length === 0) {
      this.setState({ checkedStatus: true })
    } else {
      this.setState({ checkedStatus: false })
    }
    this.setState({
      videoCollectList: data,
      dataSource: this.state.dataSource.cloneWithRows(data),
      ids: ids.join(',')
    });
    if (item.isCheck) {
      this.setState({ count: this.state.count - 1 })
    } else {
      this.setState({ count: this.state.count + 1 })
    }
  }

  goToBook = (item) => {
    window.sessionStorage.setItem('goBack', 'true')
    this.props.history.push({ pathname: 'book', state: { id: item.novel_id } })
  }

  goToVideo = (item) => {
    window.sessionStorage.setItem('goBack', 'true')
    this.props.history.push(`/detailVideo/${item.video_id}`);
  }

  callBackStateVideo = () => {
    this.setState({ isLoading: true });
    if (this.state.isStop) {
      this.setState({ isLoading: false });
      return
    } else {
      new Promise(resolve => {
        this.props.getVideoCollect({
          user_id: sessionStorage.getItem('user_id'),
          type: '2',
          resolve,
          rows: '10',
          page: String(this.state.videoPage + 1),
        })
      }).then(res => {
        if (res.length === 0) {
          this.setState({
            isStop: true,
            isLoading: false,
            loadingText: '没有更多了'
          })
          return
        }
        const newData = this.state.videoCollectList
        newData.push(...res)
        this.setState({
          videoPage: this.state.videoPage + 1,
          videoCollectList: newData,
          dataSource: this.state.dataSource.cloneWithRows(newData),
          isLoading: false,
        })
      })
    }
  }

  callBackStateBook = () => {
    this.setState({ isLoading: true });
    if (this.state.isStopBook) {
      this.setState({ isLoading: false });
      return
    } else {
      new Promise(resolve => {
        this.props.getBookCollect({
          user_id: sessionStorage.getItem('user_id'),
          resolve,
          rows: '10',
          page: String(this.state.bookPage + 1),
        })
      }).then(res => {
        if (res.length === 0) {
          this.setState({
            isStopBook: true,
            isLoading: false,
            loadingText: '没有更多了'
          })
          return
        }
        const newData = this.state.bookCollectList
        newData.push(...res)
        this.setState({
          bookPage: this.state.bookPage + 1,
          isLoading: false,
          bookCollectList: newData,
          dataSourceBook: this.state.dataSourceBook.cloneWithRows(newData),
        })
      })
    }
  }

  render() {
    const navBarProps = {
      title: '我的收藏',
      edit: true,
      onLeftClick: this.onLeftClick,
      onRightClick: this.onRightClick,
      isEdit: this.state.isEdit,
      isCollect: true,
    }
    const videoTab = () => {
      const videoPros = {
        isEdit: this.state.isEdit,
        selectOne2: this.selectOne2,
        dataSource: this.state.dataSource,
        videoCollectList: this.state.videoCollectList,
        isLoading: this.state.isLoading,
        callBackStateVideo: this.callBackStateVideo,
        goToVideo: this.goToVideo,
        loadingText: this.state.loadingText,
        isShow: this.state.isShow,
      }
      return <VideoContent {...videoPros} />
    }

    const bookTab = () => {
      const bookPros = {
        isEdit: this.state.isEdit,
        selectOne: this.selectOne,
        isLoading: this.state.isLoading,
        goToBook: this.goToBook,
        loadingText: this.state.loadingText,
        bookCollectList: this.state.bookCollectList,
        dataSourceBook: this.state.dataSourceBook,
        callBackStateBook: this.callBackStateBook,
      }
      return <BookContent {...bookPros} />
    }

    const tabs = [
      { title: '视频' },
      { title: '听书' },
    ];
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <PublicNavBar {...navBarProps} />
        <TabExample
          tabs={tabs}
          tabsContent1={videoTab}
          tabsContent2={bookTab}
          onTabChange={this.onTabChange}
        />
        <div
          style={{
            display: this.state.showFoot ? 'block' : 'none',
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: '#fff',
            zIndex: 1,
            width: '100%',
            height: 60,
          }}
        />
        <div style={{
          display: this.state.isEdit ? 'flex' : 'none',
          justifyContent: 'center',
          position: 'fixed',
          width: '100vw',
          bottom: 0
        }}>
          <Button
            onClick={this.selectAll}
            style={{ flex: '1', borderRadius: 0, color: '#7914ee' }}
          >
            {this.state.checkedStatus ? '反选' : '全选'}
          </Button>
          <Button onClick={this.deleteBtn} style={{ flex: '1', borderRadius: 0, color: '#7914ee' }}>{this.state.count !== 0 ? `删除(${this.state.count})` : '删除'}</Button>
        </div>
      </div >
    )
  }
}
export default Collect
