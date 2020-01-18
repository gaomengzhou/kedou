import React, { Component } from 'react';
import './index.less'
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	ContentItem = (props) => {
		if(props.rowData){
			const ev={...props.rowData}
			props={
				ev,
				...props
			}
		}
		return (
			<>
				<div className={props.rowData?'newVideoListContent':`${props.rowID}Content`} onClick={() => {
					if(props.goToVideoDetail){
						props.goToVideoDetail({
							video_id: props.ev.id
						})
					}else{
						props.changeActionKey(props.ev.key)
					}
				}}>
					<div className='img'>
						<img src={props.ev.picture || props.ev.cover_one} alt="" className={`classTitleImg`} />
					</div>
					<p className='title'>
						{props.ev.picture ? props.ev.class_name : props.ev.title}
					</p>
				</div>
			</>
		)
	}
	render() {
		return (
			this.ContentItem(this.props)
		);
	}
}

export default index;