import { Button, ImagePicker, Toast } from 'antd-mobile';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { userFeedBacks } from '../../../store/action/feedBack';
import { crypt } from '../../../utils/base';
import '../index.less';
import './imgpicker.less';
const mapDispatchToProps = {
  userFeedBacks
};

@connect(({ videoDetailReducer }) => ({
  videoDetailReducer
}), mapDispatchToProps)
class ImagePickerExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      userFeedBack: '',
    }
  }

  onChange = (files, type, index) => {
    this.setState({
      files,
    });
  }

  feedBackBtn = async () => {
    const userFeedBack = this.props.userFeedBack ? this.props.userFeedBack : null
    const { files } = this.state;
    const imgs = files.map((item, i) => item.url).join(',')
    if (userFeedBack === null) {
      Toast.info('请输入点内容', 1)
      return
    } else {
      try {
        let res = await this.props.userFeedBacks({
          user_id: crypt(sessionStorage.getItem('user_id')),
          role: 'user',
          message: userFeedBack,
          images: imgs,
        })
        Toast.success(res.suc)
        this.props.form.setFieldsValue({ 'userFeedBack': '' })
        this.setState({ files: [] })
      } catch (error) {
        Toast.fail(error.message)
      }
    }
  }

  render() {
    const { files } = this.state;
    return (
      <div>
        <ImagePicker
          className='imgpicker'
          files={files}
          multiple
          onChange={this.onChange}
          selectable={files.length < 3}
          accept="image/gif,image/jpeg,image/jpg,image/png"
        />
        <Button
          onClick={this.feedBackBtn}
          className='subMit'
        >提交反馈</Button>
      </div>
    );
  }
}

ImagePickerExample.propTypes = {
  userFeedBack: PropTypes.string,
  userFeedBacks: PropTypes.func,
  setFieldsValue: PropTypes.func,
}

ImagePickerExample.defaultProps = {
  userFeedBack: '',
  userFeedBacks: () => null,
  setFieldsValue: () => null,
}

export default ImagePickerExample;
