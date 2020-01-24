
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSearchBook, getSearchVideo } from '../../store/action/search';
import './index.less';
const mapDispatchToProps = {
  getSearchVideo, getSearchBook
};

@connect(({ searchVideoData }) => ({
  searchVideoData
}), mapDispatchToProps)
@withRouter
class SearchBarExample extends React.Component {
  state = {
    value: '',
    isSearch: false,
    isvideo: true,
  };
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

  goPlayer = (item) => {
    this.props.history.push(`/detailVideo/video_id=${item.id}`)
  }
  onChange = (e) => {
    this.setState({ value: e.target.value });
    if (e.target.value === '' || e.target.value === ' ') {
      this.setState({
        isSearch: false
      })
    } else {
      if (this.props.match.params.name === 'video') {
        this.props.getSearchVideo({ keyword: e.target.value })
      } else {
        this.props.getSearchBook({ keyword: e.target.value })
      }
      this.setState({
        isSearch: true
      })
    }
  };

  render() {
    if (this.state.isvideo) {
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
            />
            <span onClick={this.goback}>取消</span>
            <p className='searchIcon' />
          </div>
          {
            this.props.searchVideoData.data && this.props.searchVideoData.data.length > 0 ?
              this.props.searchVideoData.data.map(item => (
                <div key={item.id} className='searchContent'>
                  <div className='searchContentOne'>
                    <img onClick={() => this.goPlayer(item)} src={item.cover_one} alt="" />
                    <div className='searchText'>
                      <h1>{item.title}</h1>
                      <div style={{ display: 'flex' }}>
                        <p className='playerNum'>{item.play_num}</p>
                        {/* <p className='collectNum'>40504</p> */}
                      </div>
                      <div style={{ display: 'flex', marginTop: '.3rem' }}>
                        <p className='typeText1'>{item.class_name}</p>
                        <p className='typeText2'>{item.label.split('|')[2]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )) : this.state.isSearch ?
                <p className='noSearch'>未搜到相关内容</p> : null
          }
        </div>);
    } else {
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
            />
            <span onClick={this.goback}>取消</span>
            <p className='searchIcon' />
          </div>
          {
            this.props.searchVideoData.bookData && this.props.searchVideoData.bookData.length > 0 ?
              this.props.searchVideoData.bookData.map(item => (
                <div key={item.id} className='searchContent'>
                  <div className='searchContentOne'>
                    <img style={{ width: '2.7rem', height: '4rem' }} src={item.poster} alt="" />
                    <div style={{ height: '4rem' }}>
                      <div className='searchText'>
                        <h1>{item.title}</h1>
                        <div style={{ display: 'flex' }}>
                          <p className='playerNum'>{item.play}</p>
                          <p className='collectNum'>{item.love}</p>
                        </div>
                        <div style={{ display: 'flex', marginTop: '.3rem' }}>
                          <p className='typeText1'>{item.label}</p>
                          <p className='typeText2'>{'暂无'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : this.state.isSearch ?
                <p className='noSearch'>未搜到相关内容</p> : null
          }
        </div>
      );
    }
  }
}
export default SearchBarExample




