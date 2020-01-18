import { Button, ImagePicker } from 'antd-mobile';
import React from 'react';
import { connect } from 'react-redux';
import { userFeedBacks } from '../../../store/action/feedBack';
import '../index.less';
import './imgpicker.less';

// const data = [
//   {
//     url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
//     id: '2121',
//   },
//   {
//     url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
//     id: '2122',
//   }
// ];
const data = []
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
      files: data,
      userFeedBack: '',
    }
  }


  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }
  feedBackBtn = () => {
    const userFeedBack = this.props.userFeedBack ? this.props.userFeedBack : null
    const { files } = this.state;
    const imgs = files.map((item, i) => item.url).join(',')
    console.log(imgs)
    this.props.userFeedBacks({ user_id: '9633', role: 'user', message: userFeedBack, images: imgs })//做完登入再来修改动态userid
    this.props.form.setFieldsValue({ 'userFeedBack': '' })
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
          onImageClick={(index, fs) => console.log(index, fs)}
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

export default ImagePickerExample;
