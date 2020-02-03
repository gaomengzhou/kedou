import { Button, TextareaItem, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import { createForm } from 'rc-form';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PubicNavBar from '../../components/PublicNavBar';
import { contactApi } from '../../services/feedBack';
import { userFeedBacks } from '../../store/action/feedBack';
import ImagePicke from './components/imagePicker';
import './index.less';
const mapDispatchToProps = {
  userFeedBacks
};

@connect(({ videoDetailReducer }) => ({
  videoDetailReducer
}), mapDispatchToProps)
@createForm()
class UserFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgadmin: '',
      wechat: '',
      qqno: '',
      potato: '',
      telno: '',
    }
  }

  componentDidMount() {
    contactApi({ type: '1' }).then(res => {
      if (res) {
        const {
          msgadmin,
          wechat,
          qqno,
          potato,
          telno,
        } = res
        this.setState({
          msgadmin,
          wechat,
          qqno,
          potato,
          telno,
        })
      }
    })
  }

  onLeftClick = () => this.props.history.go(-1);

  sendMsg = () => {
    let what = prompt("请输入要反馈的主题: ", "意见反馈");
    let who = this.state.msgadmin
    if (what !== null && who !== '') {
      if (window.confirm(`你确定要向${who}发送主题为${what}的邮件么?`) === true) {
        window.parent.location.href = `mailto:${who}?subject=${what}`;
      }
    }
  }

  copyWechat = () => {
    copy(this.state.wechat);
    Toast.success('复制成功', 1, false)
  }

  copyQQ = () => {
    copy(this.state.qqno);
    Toast.success('复制成功', 1, false)
  }

  copyPotato = () => {
    copy(this.state.potato);
    Toast.success('复制成功', 1, false)
  }

  render() {
    const { getFieldProps } = this.props.form;
    const NavBarProps = {
      edit: false,
      title: '意见反馈',
      onLeftClick: this.onLeftClick,
    }

    return (
      <div className='body'>
        <PubicNavBar {...NavBarProps} />
        <div style={{ padding: '0.2rem' }}>
          <TextareaItem
            {...getFieldProps('userFeedBack', {
              //initialValue: '', //初始值
            })}
            placeholder='请输入您需要反馈的问题...'
            rows={8}
            count={500}
            style={{ fontSize: '.24rem' }}
          />
          <p className='feedbackimg'>反馈图片（选填，最多3张）</p>
          <ImagePicke
            userFeedBack={this.props.form.getFieldProps('userFeedBack').value}
            form={this.props.form}
          />
          <div style={{ marginTop: '.2rem', marginBottom: '.9rem' }}>
            <p className='feedbackimg'>更多反馈方式</p>
            <div className='feedBackStyles'>
              <p className='feedBackText'>联系管理员: {this.state.msgadmin}</p>
              <Button onClick={this.sendMsg} className='feedBackBtn'>发送消息</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>微信客服: {this.state.wechat}</p>
              <Button onClick={this.copyWechat} className='feedBackBtn'>复制微信号</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>客服QQ: {this.state.qqno}</p>
              <Button onClick={this.copyQQ} className='feedBackBtn'>复制QQ号</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>Potato：{this.state.potato}</p>
              <Button onClick={this.copyPotato} className='feedBackBtn'>复制号码</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>客服电话: {this.state.telno}</p>
              <Button onClick={() => window.location.href = `tel:${this.state.telno}`} className='feedBackBtn'>
                拨打电话
              </Button>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default UserFeedBack
