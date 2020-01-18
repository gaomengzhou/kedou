import { Button, Checkbox, Modal } from 'antd-mobile';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PublicNavBar from '../../components/PublicNavBar';
import { delBoolCollect, getBookCollect } from '../../store/action/collect';
import TabExample from './components/tabs';
import './index.less';

const mapDispatchToProps = {
  getBookCollect,
  delBoolCollect
};

@connect(({ userCollect }) => ({
  userCollect
}), mapDispatchToProps)
class Collect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: '',
      ids: '',//听书id
      isEdit: false,
      checkedStatus: false, //全选为true
      page: 0,//根据tabs页面决定全选哪个版块内容
      count: 0,//选中了几个
      data: [
        { id: 1, title: '好看的视频,好看的视频', isCheck: false },
        { id: 2, title: '好看的视频,好看的视频', isCheck: false },
        { id: 3, title: '好看的视频,好看的视频', isCheck: false },
        { id: 4, title: '好看的视频,好看的视频', isCheck: false },
        { id: 5, title: '好看的视频,好看的视频', isCheck: false },
      ],
      bookCollectList: [],
    }
  }

  componentDidMount() {
    new Promise(resolve => {
      this.props.getBookCollect({ user_id: sessionStorage.getItem('user_id'), resolve })
    }).then(res => {
      console.log(res)
      this.setState({
        bookCollectList: res
      })
    })
  }

  deleteBtn = () => {
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
        console.log(res)
        if (res.suc) {
          new Promise(resolve => {
            this.props.getBookCollect({ user_id: sessionStorage.getItem('user_id'), resolve })
          }).then(res => {
            console.log(res)
            this.setState({
              bookCollectList: res,
              count: 0,
              ids:'',
            })
          })
        }
      })
    }
  }

  onLeftClick = () => {
    this.props.history.go(-1)
  }

  onRightClick = () => {
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    this.state.bookCollectList.forEach((item, index, arr) => {
      data[index].isCheck = false
    })
    this.setState({
      isEdit: !this.state.isEdit,
      count: 0,
      checkedStatus: false,
      bookCollectList: data,
      ids:'',
    });
  }
  onTabChange = (v, i) => {
    //console.log(v, i)
    this.setState({ page: i })
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    this.state.bookCollectList.forEach((item, index, arr) => {
      data[index].isCheck = false
    })
    this.setState({
      checkedStatus: false,
      bookCollectList: data,
      count: 0,
      ids:'',
    })
  }

  selectAll = () => {
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    const checkedStatus = this.state.checkedStatus
    if (this.state.page === 0) {
      if (!this.state.checkedStatus) {
        this.state.data.forEach((item, index, arr) => {
          data[index].isCheck = !checkedStatus
        })
        this.setState({
          checkedStatus: !checkedStatus,
          data,
          count: this.state.data.length
        })
      } else {
        this.state.data.forEach((item, index, arr) => {
          data[index].isCheck = !checkedStatus
        })
        this.setState({
          checkedStatus: !checkedStatus,
          data,
          count: 0
        })
      }
    } else {
      if (!this.state.checkedStatus) {
        this.state.bookCollectList.forEach((item, index, arr) => {
          data[index].isCheck = !checkedStatus
        })
        const ids = data.map(item => item.novel_id)
        this.setState({
          checkedStatus: !checkedStatus,
          bookCollectList: data,
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
          count: 0,
          ids: ''
        })
      }
    }
  }
  selectOne = (e, index, item) => {
    console.log(item)
    const data = JSON.parse(JSON.stringify(this.state.bookCollectList))
    data[index].isCheck = e.target.checked
    const deleteData = data.filter(val => val.isCheck === true)
    const ids = deleteData.map(val => val.novel_id)
    console.log(ids.join(','))
    const flag = data.filter(val => val.isCheck === false)
    if (flag.length === 0) {
      this.setState({ checkedStatus: true })
    } else {
      this.setState({ checkedStatus: false })
    }
    this.setState({
      bookCollectList: data,
      ids: ids.join(',')
    });
    if (item.isCheck) {
      this.setState({ count: this.state.count - 1 })
    } else {
      this.setState({ count: this.state.count + 1 })
    }
  }

  goToBook = (item) => {
    console.log(item)
    Modal.alert('提示', '详情页完善中,请去听书页播放', [
      { text: '不去', onPress: () => console.log('cancel'), style: 'default' },
      { text: '去听书', onPress: () => this.props.history.push("/book") },
    ]);
  }


  render() {
    const { bookCollectList } = this.state;
    const CheckboxItem = Checkbox.CheckboxItem;
    const navBarProps = {
      title: '我的收藏',
      edit: true,
      onLeftClick: this.onLeftClick,
      onRightClick: this.onRightClick,
      isEdit: this.state.isEdit
    }
    const videoTab = () => {
      return (
        this.state.isEdit ?
          <>
            {
              this.state.data.map((item, index) => (
                <label key={item.id}>
                  <CheckboxItem checked={item.isCheck ? true : false} onChange={(v) => this.selectOne(v, index, item)}>
                    <div className='collectContent'>
                      <img style={{ width: '100%', height: '100%' }} src={require('../../assets/images/testphoto.png')} alt="" />
                      <p>{item.title}</p>
                      {/* <span>昨天</span> */}
                    </div>
                  </CheckboxItem>
                </label>
              ))
            }
          </> :
          <>
            {
              this.state.data.map(item => (
                <div key={item.id} className='collectContent'>
                  <img style={{ width: '100%', height: '100%' }} src={require('../../assets/images/testphoto.png')} alt="" />
                  <p>{item.title}</p>
                  {/* <span>昨天</span> */}
                </div>
              ))
            }
          </>
      )
    }

    const bookTab = () => {
      return (
        this.state.isEdit ?
          <>
            {
              bookCollectList && bookCollectList.map((item, index) => (
                <label key={item.novel_id}>
                  <CheckboxItem checked={item.isCheck ? true : false} onChange={(v) => this.selectOne(v, index, item)}>
                    <div className='collectContent'>
                      <img style={{ width: '100%', height: '100%' }} src={item.poster} alt="" />
                      <p>{item.title}</p>
                      {/* <span>昨天</span> */}
                    </div>
                  </CheckboxItem>
                </label>
              ))
            }
          </> :
          <>
            {
              bookCollectList && bookCollectList.map(item => (
                <div key={item.novel_id} className='collectContent'>
                  <img onClick={() => this.goToBook(item)} style={{ width: '100%', height: '100%' }} src={item.poster} alt="" />
                  <p>{item.title}</p>
                  {/* <span>昨天</span> */}
                </div>
              ))
            }
          </>
      )
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
