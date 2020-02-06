import { getHomeLabelList, getHomeVideoList,goBackchangeTab,goBackScrollTop,goBackList } from '../../store/action/video';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/header';
// import Login from '../../components/login';
import Tabs from '../../components/tabs';
import './index.less';
import { Modal } from 'antd-mobile';
const stateToProps = (state) => {
	return {
		video: state.video,
	}
}
const mapDispatchToProps = {
	getHomeVideoList,
	getHomeLabelList,
	goBackchangeTab,
	goBackScrollTop,
	goBackList
};


@connect(
	stateToProps,
	mapDispatchToProps
)
class Video extends Component {
	constructor(props) {
		super(props)

		this.state = {
			headerShow: true,
			loginShow: false,
			my: false
		}
	}
	getHomeLabelList = async (num) => {
		await this.props.getHomeVideoList({
			rows: 20
		})
		await this.props.getHomeLabelList({
			type: num
		})
	}
	headerShow = (b) => {
		this.setState({
			headerShow: b
		})
	}
	componentDidMount() {
		this.getHomeLabelList(0)
	}
	testCallBack = () => {
		//console.log(123);
	}
	testRightCallBack = () => {
		const { loginShow, my } = this.state
		const user_id = sessionStorage.getItem('user_id')
		if (!user_id) {
			this.props.history.push('/Login')
		} else {
			if (loginShow) {
				this.setState({
					loginShow: false,
					my: false
				})
				// this.props.history.push('/Login')
			} else {
				this.setState({
					my: !my
				})
			}

		}
	}
	closeMyLoginShow = () => {
		this.setState({
			// loginShow: false,
			my: false
		})
	}
	goBackchangeTab=(parameter)=>{
		this.props.goBackchangeTab(parameter)
	}
	goBackList=(list)=>{
		this.props.goBackList(list)
	}
	goToVideoDetail = (obj,list='') => {
		this.props.goBackScrollTop(document.body.scrollTop || document.documentElement.scrollTop)
		this.goBackList(list)
		const {
			video_id
		} = obj
		if (!sessionStorage.getItem('user_id')) {
			Modal.alert('您还没有登录', '', [
				{ text: '取消', onPress: () =>''},
				{
					text: '去登录 >',
					onPress: () => this.props.history.push({
						pathname: '/login',
						state: {
						  id:video_id,
						}
					  }),
					style:{
						color:'#9718ec'
					}
				},
			])
			return false
		}
		this.props.history.push(`/detailVideo/${video_id}`)
	}
	Popo = () => {
		const arr = [
			{
				src: `user_favorite_btn.png`,
				title: '我的收藏',
				goto: '/collect'
			}, {
				src: `user_feedback_btn.png`,
				title: '意见反馈',
				goto: '/userfeedback'
			},
			{
				src: 'user_close_btn.png',
				title: '退出登录',
				goto: '/'
			}
		]
		return (
			arr.map(e => {
				return (
					<div key={e.goto} onClick={() => {
						if (e.title === '退出登录') {
							sessionStorage.removeItem('user_id')
							sessionStorage.removeItem('invitation_code')
							this.setState({
								my: false
							})
							return false
						}
						this.props.history.push(e.goto)
					}}>
						<div style={{
							width: '70%',
							margin: 'auto',
							padding: '.1rem'
						}}>
							<img src={require(`../../assets/images/${e.src}`)} alt="" style={{
								width: '100%',
								height: '100%'
							}} />
						</div>
						<p style={{
							textAlign: 'center',
							padding: '0 0 .1rem 0'
						}}>{e.title}</p>

					</div>
				)
			})
		)
	}
	render() {
		// console.log(this.props);
		const {
			video
		} = this.props
		const { my } = this.state
		const tabsParameter = {
			newVideoList: video.newVideoList,
			hotVideoList: video.hotVideoList,
			labelList: video.labelList,
			recommend: video.recommend,
			hotLabel: video.hotLabel,
			getHomeLabelList: this.props.getHomeLabelList,
			goToVideoDetail: this.goToVideoDetail,
			headerShow: this.headerShow,
			closeMyLoginShow: this.closeMyLoginShow,
			goBackchangeTab:this.goBackchangeTab,
			route:'video'
		}
		const videoHeader = {
			leftCallBack: this.testCallBack,
			rightCallBack: this.testRightCallBack,
			type: 'video'
		}
		return (
			< div id='home-video'>
				{this.state.headerShow && <Header {...videoHeader} />}
				<Tabs {...tabsParameter} />
				{/* {loginShow && <Login rightCallBack={this.testRightCallBack} />} */}
				{
					my && <div style={{
						position: 'fixed',
						top: '1rem',
						left: '.1rem',
						zIndex: '1000',
						padding: '.1rem',
						backgroundColor: '#fff',
						borderRadius: '.1rem'
					}}>
						{
							this.Popo()
						}
						<div style={{
							position: 'absolute',
							top: '-.2rem',
							left: '20%',
							borderTop: ' .1rem solid transparent',
							borderBottom: '.1rem solid #fff',
							borderLeft: '.1rem solid transparent',
							borderRight: '.1rem solid transparent'
						}}></div>
					</div>
				}
			</div >
		);
	}
}

export default Video;
