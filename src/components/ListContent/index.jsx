import React, { Component } from 'react';
import './index.less'
import { Icon } from 'antd-mobile';
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: true,
		}
	}
	ContentItem = (props) => {
		if (props.rowData) {
			const ev = { ...props.rowData }
			props = {
				ev,
				...props
			}
		}
		const { loaded } = this.state
		return (
			<>
				<div className={props.rowData ? 'newVideoListContent' : `${props.rowID}Content`} onClick={() => {
					if (props.goToVideoDetail) {
						props.goToVideoDetail({
							video_id: props.ev.id
						})
					} else {
						props.changeActionKey(props.ev.key)
					}
				}}>
					<div className='img' style={{
						position: 'relative'
					}}>
						{loaded && <div style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
							margin: 'auto',
							width:'100%',
							height:'100%'
						}}>
							<Icon type='loading' style={{
							position:'absolute',
							top:0,
							bottom:0,
							left:0,
							right:0,
							margin:'auto',
						}}/>
						</div>}
						{<img src={props.ev.picture || props.ev.cover_one} alt="" className={loaded ? `classTitleImg` : 'classTitleImgLoad'} onLoad={() => { this.onLoad() }} ref={(thisImg) => {
							this.thisImg = thisImg
						}} onError={() => {
							console.log('err');

						}} />}
					</div>
					 <p className='title'>
						{props.ev.picture ? (!loaded&&props.ev.class_name) : props.ev.title}
					</p>
				</div>
			</>
		)
	}
	onLoad = async () => {
		console.log(1);

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