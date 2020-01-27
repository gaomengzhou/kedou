
import { ListView } from 'antd-mobile';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSearchBook, getSearchVideo } from '../../store/action/search';
import BookSearch from './components/BookContent';
import VideoSearch from './components/VideoContent';
import './index.less';
const mapDispatchToProps = {
  getSearchVideo, getSearchBook
};

@connect(({ searchVideoData }) => ({
  searchVideoData
}), mapDispatchToProps)
@withRouter
class SearchBarExample extends React.Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      stopRequest: false,
      keyword: '',
      noData: false,
      dataSource,
      value: '',
      isSearch: false,
      isvideo: true,
      page: 1,// 请求分页
      videoData: [],
      bookDate: [],
      isLoading: true,
    }
  }

  componentDidMount() {
    if (this.props.match.params.name === 'book') {
      this.setState({
        isvideo: false
      })
    }
  }

  componentWillUnmount() {
    this.props.searchVideoData.data = []
    this.props.searchVideoData.bookData = []
  }

  goback = () => {
    this.props.history.go(-1)
  }

  goBook = (item) => {
    this.props.history.push({
      pathname: '/book',
      state: { id: item.id }
    })
  }

  goPlayer = (item) => {
    this.props.history.push(`/detailVideo/video_id=${item.id}`)
  }
  onChange = async (e) => {
    console.log(e.target.value)
    this.setState({ value: e.target.value });
    if (e.target.value === '' || e.target.value === ' ') {
      this.setState({
        isSearch: false
      })
    } else {
      if (this.props.match.params.name === 'video') {
        this.setState({
          keyword: e.target.value,
          stopRequest: false,
          page: 1,
        })
        const res = await this.props.getSearchVideo({ keyword: e.target.value, rows: '10', page: '1' })
        if (res.length > 0) {
          this.setState({
            videoData: res,
            dataSource: this.state.dataSource.cloneWithRows(res),
            isLoading: false,
            noData: false,//有数据
          })
        }
        if (res.length === 0) {
          this.setState({
            noData: true // 没数据
          })
        }
        if (res.length < 10) {
          this.setState({
            stopRequest: true,
          })
        }
      } else {
        this.setState({
          keyword: e.target.value,
          stopRequest: false,
          page: 1,
        })
        const res = await this.props.getSearchBook({ keyword: e.target.value, rows: '10', page: '1' })
        if (res.length > 0) {
          this.setState({
            bookData: res,
            dataSource: this.state.dataSource.cloneWithRows(res),
            isLoading: false,
            noData: false,//有数据
          })
        }
        if (res.length === 0) {
          this.setState({
            noData: true // 没数据
          })
        }
        if (res.length < 10) {
          this.setState({
            stopRequest: true,
          })
        }
      }
      this.setState({
        isSearch: true
      })
    }
  };

  onScrollVideoData = async () => { //视频滑动请求
    if (!this.state.stopRequest) {
      this.setState({ isLoading: true });
      const res = await this.props.getSearchVideo({
        keyword: this.state.keyword,
        rows: '10',
        page: String(this.state.page + 1)
      })
      if (res.length < 10) {
        this.setState({
          stopRequest: true,
        })
        return
      } else {
        const videoData = this.state.videoData
        videoData.push(...res)
        this.setState({
          page: this.state.page + 1,
          isLoading: false,
          videoData,
          dataSource: this.state.dataSource.cloneWithRows(videoData),
        })
      }
    }
  }

  keyUp = () => {
    const values = this.state.value;
    const value = values.replace(/\s+/g, '')
    this.setState({
      value,
    })
  }
  render() {
    if (this.state.isvideo) {
      const videoSearchProps = {
        dataSource: this.state.dataSource,
        noData: this.state.noData,
        goPlayer: this.goPlayer,
        onScrollVideoData: this.onScrollVideoData,
      }
      return (
        <div>
          <div className='searchHeader'>
            <input
              type="text"
              autoFocus="autofocus"
              placeholder='输入搜索关键词'
              onChange={this.onChange}
              value={this.state.value}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.keyUp}
            />
            <span onClick={this.goback}>取消</span>
            <p className='searchIcon' />
          </div>
          {
            !this.state.noData
              ? <VideoSearch {...videoSearchProps} />
              : this.state.isSearch
                ? <p className='noSearch'>未搜到相关内容</p>
                : null
          }
        </div>
      );
    } else {
      const bookSearchProps = {
        dataSource: this.state.dataSource,
        noData: this.state.noData,
        goBook: this.goBook,
        onScrollVideoData: this.onScrollVideoData
      }
      return (
        <div>
          <div className='searchHeader'>
            <input
              type="search"
              autoFocus="autofocus"
              placeholder='输入搜索关键词'
              onChange={this.onChange}
              value={this.state.value}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.keyUp}
            />
            <span onClick={this.goback}>取消</span>
            <p className='searchIcon' />
          </div>
          {
            !this.state.noData
              ? <BookSearch {...bookSearchProps} />
              : this.state.isSearch
                ? < p className='noSearch'>未搜到相关内容</p>
                : null
          }
        </div >
      );
    }
  }
}
export default SearchBarExample




