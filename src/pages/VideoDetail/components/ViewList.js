/* eslint-disable array-callback-return */
import { ListView } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { getChatApi } from '../../../services/videoDetail';
import ListContent from './ListContent';
@withRouter
class MyViewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noMore: false,
      page: 1,
      commentList: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      hasMore: false,//来自后端数据，指示是否为最后一页，这里为false
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
    };
  }

  componentDidMount() {
    this.getDataInit()
  }

  componentWillUpdate(nextProps, nextState) {
    const { id } = this.props.match.params
    if (nextProps.isReload) {
      getChatApi({
        page: '1',
        rows: '10',
        user_id: sessionStorage.getItem('user_id'),
        video_id: id.split('&')[0]
      }).then(res => {
        this.props.cb();
        if (res) {
          this.setState({
            commentList: res.comment,
            dataSource: this.state.dataSource.cloneWithRows(res.comment),
            isLoading: false,
          })
        }
      })
    }
  }

  getDataInit = () => {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    const { id } = this.props.match.params
    getChatApi({
      page: '1',
      rows: '10',
      user_id: sessionStorage.getItem('user_id'),
      video_id: id.split('&')[0]
    }).then(res => {
      this.setState({
        commentList: res.comment,
        dataSource: this.state.dataSource.cloneWithRows(res.comment),
        isLoading: false,
        height: hei,
      })
    })
  }

  onEndReached = (event) => {
    const { id } = this.props.match.params
    const dataList = this.state.commentList
    if (this.state.noMore) {
      return
    }
    getChatApi({
      page: String(this.state.page + 1),
      rows: '10',
      user_id: sessionStorage.getItem('user_id'),
      video_id: id.split('&')[0]
    }).then(res => {
      if (res.comment.length === 0) {
        this.setState({
          noMore: true,
          page: '1'
        })
        return
      }
      const commentList = dataList.concat(res.comment)
      this.setState({
        commentList,
        dataSource: this.state.dataSource.cloneWithRows(commentList),
        page: this.state.page + 1
      })
    })
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    const row = (rowData, sectionID, rowID) => {
      const listContentProps = {
        getDataInit: this.getDataInit,
        clickLike: this.clickLike,
        rowData: rowData,
        rowID: rowID
      }
      return (
        <ListContent {...listContentProps} />
      );
    };

    return (
      <ListView
        ref={el => this.lv = el}
        className='video-detail-list-view'
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ textAlign: 'center' }}>
          {/* {this.state.isLoading ? '加载中...' : '加载完毕'} */}
        </div>)}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        // onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}


export default MyViewList
