/**
 * @description  video 页面 列表项组件
 * @memberof ListContent
 * @requires ListView
 * @param {Array} rowData-基于ListView组件 需传入 rowData
 * @time 2020/1/9
 * @author Aiden
 */

import React, { Component } from 'react';
import './index.less'
import { ActivityIndicator } from 'antd-mobile';
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: true,
			imgErr:false
		}
	}
	//格式化参数 并渲染
	ContentItem = (props) => {
		if (props.rowData) {
			const ev = { ...props.rowData }
			props = {
				ev,
				...props
			}
		}
		const { loaded,imgErr } = this.state
		const ActivityIndicatorStyle = {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			margin: 'auto',
			width: '100%',
			height: '100%',
			display: ' flex',
			justifyContent: 'space-around',
			alignItems: 'center',
		}
		return (
			<>
				<div className={props.rowData ? 'newVideoListContent' : `${props.rowID}Content`} onClick={() => {
					if (props.goToVideoDetail) {
						props.goToVideoDetail({
							video_id: props.ev.id
						},this.props.onClickasd())
					} else {
						props.changeActionKey(props.ev.key)
					}
				}}>
					<div className='img' style={{
						position: 'relative'
					}}>
						{loaded && <div style={ActivityIndicatorStyle}>
							<ActivityIndicator text='Loading...' />
						</div>}
						<img src={!imgErr?props.ev.picture || props.ev.cover_one:require('../../assets/images/error1_thumbnail_bg.png')} alt="" className={loaded ? `classTitleImg` : 'classTitleImgLoad'} onLoad={() => { this.onLoad() }} onError={() => {
							console.log('图片显示错误');
							this.setState({
								imgErr:true
							})
						}} />
					</div>
					<p className='title'>
						{props.ev.picture ? (!loaded && props.ev.class_name) : props.ev.title}
					</p>
				</div>
			</>
		)
	}
	//加载完毕执行函数
	onLoad = async () => {
		this.setState({
			loaded: false
		})


	};
	render() {
		return (
			this.ContentItem(this.props)
		);
	}
}

export default index;