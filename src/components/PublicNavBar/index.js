/**
 * 公共NavBar
 * @param {boolean}  isEdit           是否显示右侧编辑按钮
 * @param {function} rightContent     右侧编辑按钮
 * @param {function} onLeftClick      左侧返回按钮
 * @param {boolean}  isDetail         是否是视频详情页-如果是头部会绝对定位加背景透明
 * @param {boolean}  isCollect        是否是收藏页-如果是头部会固定定位在顶部
 */

import { NavBar } from 'antd-mobile';
import PropTypes from 'prop-types';
import React from 'react';
import BackArrow from './components/backIcon';
import './index.less';
const PublicNavBar = (props) => {
  return (
    <div style={{ boxShadow: '1px 1px 1px #e2e1e1' }}>
      <NavBar
        className='navbar'
        style={
          props.isDetail ? {
            width: '100vw',
            background: "rgba(255, 255, 255, 0)",
            position: 'absolute',
            top: props.display ? '-.9rem' : 0,
            left: 0,
            zIndex: 1,
            transition: '.4s',
          } : props.isCollect ? {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 2,
          } : {}
        }
        icon={<BackArrow type="left" />}
        onLeftClick={() => props.onLeftClick()}
        rightContent={props.edit ? <span onClick={() => props.onRightClick()}>{props.isEdit ? '取消' : '编辑'}</span> : null}
      >
        {props.title}
      </NavBar>
    </div>
  )
}

PublicNavBar.propTypes = {
  edit: PropTypes.bool,
  isDetail: PropTypes.bool,
  isCollect: PropTypes.bool,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
}

PublicNavBar.defaultProps = {
  edit: false,
  isDetail: false,
  isCollect: false,
  onLeftClick: () => console.log('没有传入onLeftClick这个props'),
  onRightClick: () => console.log('没有传入onRightClick这个props'),
}


export default PublicNavBar
