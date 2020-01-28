import { Modal } from 'antd-mobile';
import React from 'react';
import './modal.less';
import MyListView from './ViewList';


const ModalPlayer = (props) => {
  const bodyScroll = (e) => { e.preventDefault(); }
  const viewProps = {
    cb: props.cb,
    isReload: props.isReload,
    dataSource: props.dataSource,
    getChat: props.getChat
  }
  if (document.querySelector('.playerModals') !== null) {
    document.querySelector('.playerModals').addEventListener('touchmove', bodyScroll, { passive: false })
  }
  return (
    <div className='playerModals'>
      <Modal
        style={{ height: '9rem' }}
        wrapClassName='playerModal'
        className='playerModal'
        popup
        visible={props.visible}
        closable
        maskClosable
        onClose={props.onClose}
        animationType="slide-up"
        title={`全部评论 (${props.commentNum ? props.commentNum : 0})`}
      >
        <MyListView {...viewProps} />
      </Modal>
    </div>
  )
}
export default ModalPlayer
