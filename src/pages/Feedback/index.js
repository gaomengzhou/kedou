import { Button, TextareaItem, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import { createForm } from 'rc-form';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PubicNavBar from '../../components/PublicNavBar';
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
      weChat: 'kedouzb',
      qq: '826301938',
      potato: 'kedouyifei',
      tel: '123-123-123',
    }
  }

  onLeftClick = () => this.props.history.go(-1);
  sendMsg = () => {
    Toast.info('完善中,敬请期待!',1,false)
  }
  copyWechat = () => {
    copy(this.state.weChat);
    Toast.success('复制成功', 1, false)
  }
  copyQQ = () => {
    copy(this.state.qq);
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
            placeholder='请详细输入您需要解决的问题，就算您提交了我们也依然不会改，有效截图有助于我们客服找到并物理超度您，非常感谢您的配合。'
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
              <p className='feedBackText'>联系管理员</p>
              <Button onClick={this.sendMsg} className='feedBackBtn'>发送消息</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>微信客服: {this.state.weChat}</p>
              <Button onClick={this.copyWechat} className='feedBackBtn'>复制微信号</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>客服QQ: {this.state.qq}</p>
              <Button onClick={this.copyQQ} className='feedBackBtn'>复制QQ号</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>Potato：{this.state.potato}</p>
              <Button onClick={this.copyPotato} className='feedBackBtn'>复制号码</Button>
            </div>
            <div className='feedBackStyles'>
              <p className='feedBackText'>客服电话: {this.state.tel}</p>
              <Button className='feedBackBtn'>
                <a style={{ color: '#000' }} href={`tel:${this.state.tel}`}>拨打电话</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default UserFeedBack
