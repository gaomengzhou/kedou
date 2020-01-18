/**
 * 公共NavBar
 */

import { NavBar } from 'antd-mobile';
import React from 'react';
import BackArrow from './components/backIcon';
import './index.less';

export default function PublicNavBar(props) {
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

