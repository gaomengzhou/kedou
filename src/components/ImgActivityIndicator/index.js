import { ActivityIndicator } from 'antd-mobile';
import React, { Component } from 'react';
import './style.less';
/**
 * 图片懒加载的样式
 * @param {string}                    src       图片地址
 * @param {'number' or 'px' or 'rem'} [option]  传入top left 定位距离
 * @param {'number' or 'px' or 'rem'} [option]  width height css属性
 */
class ImgLoad extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imgLoad: true
    }
  }
  componentDidMount() {
    if (!this.props.src) {
      this.setState({
        imgLoad: false
      })
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
        <div id='img-activity-indicator' style={{
          position: 'absolute',
          top: this.props.top,
          left: this.props.left,
          display: this.state.imgLoad ? 'block' : 'none',
          zIndex: 2
        }}>
          <ActivityIndicator
            animating={this.state.imgLoad}
            text={'图片加载中...'}
          />
        </div>
        <div style={{
          boxShadow: '#999 1px 1px 5px',
          width: this.props.width,
          height: this.props.height,
          borderRadius: '.3rem',
        }}>
          <img
            onClick={this.props.onClick}
            onLoad={this.imgLoadOver}
            style={{
              width: '100%',
              height: '100%',
              transition: '.5s',
              opacity: this.state.imgLoad ? 0 : 1,
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
        </div>
      </>
    )
  }
}
export default ImgLoad
