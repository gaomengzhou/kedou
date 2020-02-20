/**
 * @description <猜你喜欢> 
 * @memberof Audio
 * @parameter 听书详情页猜你喜欢项
 * @time 2020/1/23
 * @author Aiden
 */
import React from 'react'
import { ActivityIndicator } from 'antd-mobile'
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
function index(porps) {
	const { loaded, onLoad } = porps
	return (
		<div className='bookDetailGuess'>
			<div className="img" onClick={() => {
				porps.getBooKDetail(porps.id)
			}} style={{
				position: 'relative'
			}} >
				{loaded && <div style={ActivityIndicatorStyle}>
					<ActivityIndicator text='Loading...' />
				</div>}
				<img src={porps.poster} alt="" className={loaded ? 'guessImgLoaded' : 'guessImg'} onLoad={() => { onLoad() }} />
			</div>
			<div className="right">
				<p className='rightTitle'>
					{porps.title}
				</p>
				<div className="guessContent">
					<div className="play">
						<img src={require('../../assets/images/history_play_ico.png')} alt="" />
						<span>
							{porps.play}
						</span>
					</div>
					<div className="love">
						<img src={require('../../assets/images/history_like_ico.png')} alt="" />
						<span>
							{porps.love}
						</span>
					</div>
				</div>
				<div className="label">
					{porps.label}
				</div>
			</div>
		</div>
	)
}

export default index
