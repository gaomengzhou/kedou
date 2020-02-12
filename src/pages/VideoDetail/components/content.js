import { Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import PropTypes, { oneOfType } from 'prop-types';
import React from 'react';
import ImgLoad from '../../../components/ImgActivityIndicator';
import '../player.less';

const Content = (props) => {
  const onPress = (item) => {
    document.body.scrollTop = document.documentElement.scrollTop = 0
    props.router.history.replace(`/videoDetail/${item.id}`);
  }
  const copyAccessKey = () => {
    if (props.detailData.share_url) {
      let shareUrl = window.location.href
      shareUrl = `${shareUrl}/${sessionStorage.getItem('invitation_code')}`
      copy(shareUrl)
      Toast.success('已复制邀请链接,粘贴分享给好友')
    } else {
      Toast.fail('分享复制失败')
    }
  }

  const downApp = () => {
    const { share_url } = props.detailData
    window.open(share_url)
  }

  return (
    <div id='contentPlayer' style={{ padding: '.1rem', background: '#fff' }}>
      <div className='title'>
        <p style={{ fontWeight: 900 }} className='titleLogo'><img src={require('../../../assets/images/ico@2x.png')} alt="" /></p>
        <p className='titleText'>{props.detailData.title}</p>
        <p className='lastP'>
          <span style={{ fontSize: '.35rem', color: "#840fe4", fontWeight: 900 }}>{props.detailData.play_num}</span>看过
        </p>
      </div>
      <div className='collect'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
          <p onClick={props.likedClick} className={props.fabulous_video !== 0 ? 'icon1Press' : 'icon1'}><span>{props.liked_num}</span></p>  {/*点赞数量*/}
          <p className='icon2' onClick={() => props.showComment2('anchor')}><span>{props.comment_num}</span></p>  {/*评论数量*/}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
          <p onClick={props.collectBtn} className={props.isCollect ? 'icon3Press' : 'icon3'}></p>{/*收藏*/}
          <p onClick={copyAccessKey} className='icon4'></p>{/*分享*/}
        </div>
      </div>
      <div className="video-detail-banner">
        <img onClick={downApp} src={require('../../../assets/images/banner-detail.png')} alt="下载广告" />
      </div>
      <div className='hotVideo'>
        <p className='hotTitle'>猜你喜欢</p>
        <div className='collectContent'>
          {
            props.dataList && props.dataList.map(item => (
              <div
                style={{
                  width: '3.5rem',
                  height: '2.5rem',
                  position: 'relative',
                }}
                key={item.id}
              >
                <ImgLoad
                  onClick={() => onPress(item)}
                  src={item.cover_one}
                  top={'35%'}
                  left={'25%'}
                  width={'100%'}
                  height={'80%'}
                />
                <p>{item.title}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

Content.propTypes = {
  fabulous_video: oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  liked_num: oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  comment_num: oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  detailData: PropTypes.object,
  likedClick: PropTypes.func,
  showComment2: PropTypes.func,
  collectBtn: PropTypes.func,
  isCollect: PropTypes.bool,
  dataList: PropTypes.array,
}

Content.defaultProps = {
  fabulous_video: 0,
  liked_num: 0,
  comment_num: 0,
  detailData: {},
  likedClick: () => null,
  showComment2: () => null,
  collectBtn: () => null,
  isCollect: false,
  dataList: [],
}


export default Content
