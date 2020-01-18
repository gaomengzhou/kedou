import { Modal } from 'antd-mobile';
import React from 'react';
import './modal.less';
import MyListView from './ViewList';


const ModalPlayer = (props) => {
  return (
    <div className='playerModals'>
      <Modal
        style={{ height: '9rem' }}
        wrapClassName='playerModal'
        className='playerModal'
        popup
        visible={props.visible}
        closable
        maskClosable={false}
        onClose={props.onClose}
        animationType="slide-up"
        title={`全部评论 (${300})`}
      >
      <MyListView />
      </Modal>
    </div>
  )
}
export default ModalPlayer
