import { ActivityIndicator } from 'antd-mobile';
import React, { Component } from 'react';
/**
 * {item} 图片数据
 * {top} {left} 定位距离
 * {width} {height} css属性
 */
class ImgLoad extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imgLoad: true
    }
  }
  imgLoadOver = () => {
    this.setState({
      imgLoad: false
    })
  }
  render() {
    return (
      <>
        <div style={{
          position: 'absolute',
          top: this.props.top,
          left: this.props.left,
          display: this.state.imgLoad ? 'block' : 'none'
        }}>
          <ActivityIndicator animating={this.state.imgLoad} text={'图片加载中...'} />
        </div>
        <img
          onClick={this.props.onClick}
          onLoad={this.imgLoadOver}
          style={{
            width: this.props.width,
            height: this.props.height,
            opacity: this.state.imgLoad ? 0 : 1,
            boxShadow: '#999 1px 1px 5px'
          }}
          src={
            this.props.src ? this.props.src : ''
          }
          alt={
            this.props.src
              ? ''
              : '暂无图片'
          }
        />
      </>
    )
  }
}
export default ImgLoad
