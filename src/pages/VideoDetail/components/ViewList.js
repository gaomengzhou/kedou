import { ListView } from 'antd-mobile';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CommentItem from '../../../components/CommentItem';
import { getChatApi } from '../../../services/videoDetail';
import './style.less';

@withRouter
class MyViewList extends React.Component {
  constructor(props) {
    super(props);
    this.setSroll = null;
    this.state = {
      noMore: false,
      textComent: '加载完毕',
      page: 1,
      commentList: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      hasMore: false,//来自后端数据，指示是否为最后一页，这里为false
      isLoading: true,
      paramsId: '',
    };
  }

  componentDidMount() {
    this.getDataInit()
    this.setState({
      paramsId: this.props.match.params.id
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getDataInit()
    }

    if (this.props.isReload) {
      this.setState({
        commentList: [],
        dataSource: this.state.dataSource.cloneWithRows([]),
        isLoading: true,
        noMore: true
      },()=>{
       this.getDataInit()
       this.props.cb()
        setTimeout(() => {
          const contentHeight = document.getElementById('contentPlayer').offsetHeight;
          const dpHeight = document.getElementById('dplayer').offsetHeight;
          document.documentElement.scrollTop = contentHeight + dpHeight;
        }, 300);
      })
    }
  }

  getDataInit = () => {
    const { id } = this.props.match.params
    this.setState({ isLoading: true })
    getChatApi({
      page: '1',
      rows: '10',
      user_id: sessionStorage.getItem('user_id'),
      video_id: id
    }).then(res => {
      this.setState({
        commentList: res.comment,
        dataSource: this.state.dataSource.cloneWithRows(res.comment),
        isLoading: false,
        noMore: false
      });
    })
  }

  onEndReached = (event) => {
    const { id } = this.props.match.params
    const dataList = this.state.commentList
    if (this.state.noMore) {
      return
    }
    this.setState({
      isLoading: true
    })
    getChatApi({
      page: String(this.state.page + 1),
      rows: '10',
      user_id: sessionStorage.getItem('user_id'),
      video_id: id
    }).then(res => {
      if (res.comment.length === 0) {
        this.setState({
          noMore: true,
          isLoading: false,
          page: 1,
        })
        return
      }
      const commentList = dataList.concat(res.comment)
      this.setState({
        commentList,
        dataSource: this.state.dataSource.cloneWithRows(commentList),
        page: this.state.page + 1,
        isLoading: false,
      })
    })
  }
  textareaIput = () => {
    document.getElementById('textareaIput').blur();
    this.props.cbClosed()
  }

  render() {
    const row = (rowData, sectionID, rowID) => {
      return (
        <CommentItem rowData={rowData} type={'video'} />
      );
    };

    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        className='video-detail-list'
        renderFooter={() => {
          if (!this.state.commentList.length) {
            return (
              <div style={{ textAlign: 'center', padding: 50 }}>
                暂无评论,快来评论一条吧!
              </div>
            )
          }
          return (
            <div style={{ textAlign: 'center' }}>
              {
                this.state.commentList.length > 5 ?
                  (this.state.isLoading ? '加载中...' : (this.state.noMore ? '没有更多的评论了' : ''))
                  : ''
              }
            </div>
          )
        }}
        renderRow={row}
        useBodyScroll
        pageSize={10}
        scrollRenderAheadDistance={500}
        onScroll={this.props.closed ? this.textareaIput : null}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}


export default MyViewList
