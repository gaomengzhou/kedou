/**
 * @description 听书播放器&听书详情组件
 * @memberof book
 * @time 2020/1/23
 * @author Aiden
 */
import { crypt } from '../../utils/base'
import { ListView, Modal, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import React from 'react';
import ReactAplayer from 'react-aplayer';
import { withRouter } from 'react-router-dom';
import { collect, comment, comment_add, novel_thumbs } from '../../services/book';
import BookDetailGuess from '../BookDetailGuess';
import CommentItem from '../CommentItem';
import ListTitle from '../ListTitle';
import './index.scss';
import { connect } from 'react-redux'
import { setOnRefresh } from '../../store/action/book'
let iTimeout;
let iInterval;
// let alertInstance;
let changeSrcTimer
// let alertTimer
const stateToProps = (state) => {
	return {
		refresh: state.book.refresh,
	}
}
const mapDispatchToProps = {
	setOnRefresh
};
@connect(
	stateToProps,
	mapDispatchToProps,
)
@withRouter

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			serialNum: 1,
			serialShow: false,
			playerList: [],
			player: '',
			show: false,
			detailShow: true,
			play: false,
			serial: '第1集',
			modal2: false,
			commentShow: true,
			commentTitle: '',
			commentList: [],
			isLoading: false,
			noMore: false,
			isRefreshing: true,
			page: 1,
			commentValue: '',
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			timeClose: false,
			Countdown: false,
			timeNum: 1,
			Timer: '',
			minutes: '',
			setTimeNum: '',
			comment_num: '',
			thumb_num: '',
			loaded: true,
			thumbed: '',
			subMitShow: false,
			timer: '',
			scrollHidden: false,
			bodyScroll: '',
			anchorElement: '',
			countScrollTop: '',
			rotateZ: ''
		}
	}
	componentDidMount() {
		this.setState({
			collected: this.props.detailInfo.collected,
			name: this.props.novelTitle,
			url: this.props.player.src,
			cover: this.props.novelPoster,
			comment_num: this.props.detailInfo.comment_num,
			thumb_num: this.props.detailInfo.thumb_num,
			show: true,
			collectedNum: this.props.detailInfo.love,
			thumbed: this.props.detailInfo.thumbed
		}, () => {
			document.querySelector('.aplayer-author').innerHTML = '第1集'
			document.querySelector('.aplayer-icon-loop').remove()
			document.body.scrollTop = document.documentElement.scrollTop = 0
			this.getComment()
		})
	}
	componentWillUnmount() {
		this.onPause()
		this.props.setDetailShow()
		clearTimeout(iTimeout)
		clearInterval(iInterval)
		clearTimeout(changeSrcTimer)
	}

	static getDerivedStateFromProps(props, state) {
		if (props.serials) {
			return {
				playerList: props.serials
			}
		}
		return null
	}
	// event binding example
	onPlay = () => {
		this.setState({
			play: true
		})
		console.log('on play');
	};

	onPause = () => {
		this.ap.pause()
		this.getTranslate('onPosterRotateZ')
		this.setState({
			play: false
		})
	};

	// example of access aplayer instance
	onInit = ap => {
		this.ap = ap;
	};
	changeSrc = async (url, num) => {
		this.onPause()
		clearTimeout(changeSrcTimer)
		await this.setState({
			show: false
		})
		await this.setState({
			url,
			show: true,
			serialShow: false
		}, () => {
			if (this.state.serialShow) {
				this.props.setOnRefresh(false)
			} else {
				this.props.setOnRefresh(true)
			}
			document.querySelector('.aplayer-author').innerHTML = `第${num}集`
			document.querySelector('.aplayer-icon-loop').remove()
			this.setState({
				serialNum: num,
				serial: `第${num}集`,
				modal2: false
			}, () => {
				if (!this.state.play) {
					changeSrcTimer = setTimeout(() => {
						this.ap.toggle()
					}, 1000);
				}
			})
		})
	}
	setCollect = (novel_id) => {
		collect({
			user_id: crypt(sessionStorage.getItem('user_id')),
			novel_id: novel_id
		}).then(res => {
			if (res.code === 0) {
				Toast.info(res.suc, 1, null, false)
				if (res.suc === '取消成功') {
					this.setState({
						collectedNum: this.state.collectedNum - 1,
						collected: 0
					})
					return false
				}
				this.setState({
					collectedNum: this.state.collectedNum + 1,
					collected: 1
				})
			} else {
				Toast.info(res.err)
			}
		})
	}
	getComment = async (string) => {
		await this.setState({
			isLoading: true
		})
		await comment({
			user_id: crypt(sessionStorage.getItem('user_id')),
			novel_id: this.props.detailInfo.id,
			page: 1,
			rows: 10
		}).then(res => {
			const commentList = res.list
			this.setState({
				commentTitle: res.total,
				page: 1,
				commentList,
				noMore: false,
				isLoading: false,
				dataSource: this.state.dataSource.cloneWithRows(commentList),
			}, () => {
				if (string === '评论') {
					this.setState({
						timer: Date.now(),
					})
					document.body.scrollTop = document.documentElement.scrollTop = document.getElementById('activity').offsetTop
					Toast.info('评论成功', 1, null, false)
				}

			})
		})
	}
	concatList = () => {
		const list = this.state.commentList
		comment({
			user_id: crypt(sessionStorage.getItem('user_id')),
			novel_id: this.props.detailInfo.id,
			page: this.state.page + 1,
			rows: 10
		}).then(res => {
			if (res.list.length === 0) {
				this.setState({
					noMore: true
				})
				return
			}
			const commentList = list.concat(res.list)
			this.setState({
				commentList,
				commentTitle: res.total,
				page: this.state.page + 1,
				dataSource: this.state.dataSource.cloneWithRows(commentList),
			})
		})

	}
	onEndReached = () => {
		let loading = true
		if (this.state.noMore) {
			return false
		}
		this.setState({
			isLoading: true
		})
		if (loading) {
			this.concatList()
		}
		this.setState({
			isLoading: false
		})
		loading = false
	}
	changeCommentValue = (e) => {
		const commentValue = e.target.value
		this.setState({
			commentValue
		})
	}
	commentSubMit = async (timer) => {
		const { commentValue, timer: oldTimer } = this.state
		if (!commentValue) {
			Toast.info('请输入评论内容')
			return false
		}
		if (timer - oldTimer < 10000) {
			await Toast.info('评论太快了,休息一下')
			return false
		}

		await this.setState({
			commentValue: ''
		})

		await comment_add({
			user_id: crypt(sessionStorage.getItem('user_id')),
			novel_id: this.props.detailInfo.id,
			message: commentValue
		}).then(res => {
			if (res.code === 0) {
				this.setState({
					commentValue: '',
					subMit: false,
					commentList: [],
					page: 1,
					noMore: true,
					dataSource: this.state.dataSource.cloneWithRows([])
				}, () => {
					this.commentIpt.blur()
					this.getComment('评论')
				})
			} else {
				Toast.info(res.err, 1, null, false)
			}

		})
	}
	changePlay = (num) => {
		const {
			state: {
				playerList,
				serialNum
			},
			changeSrc
		} = this
		if (serialNum === 1 && num === -1) {
			Toast.info('已经是第一集了', 1, null, false)
			this.onPause()
			return false
		}
		if (serialNum === playerList.length && num === 1) {
			Toast.info('已经是最后一集了', 1, null, false)
			this.onPause()
			return false
		}
		playerList.forEach(e => {
			if (e.serial === (serialNum + num)) {
				changeSrc(e.src, e.serial)
			}
		})

	}
	setTimePlay = () => {
		this.setState({
			timeClose: true
		})

	}

	formatDuring = (mss) => {
		var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = (mss % (1000 * 60)) / 1000;
		if ((minutes + '').length === 1) {
			minutes = '0' + minutes
		}
		if ((seconds + '').length === 1) {
			seconds = '0' + seconds
		}
		if ((hours + '').length === 1) {
			hours = '0' + hours
		}
		this.setState({
			Timer: hours + ":" + minutes + ":" + seconds
		})
	}
	setTimeoutByPlay = (key) => {
		let keyNum = key * 60000
		switch (key) {
			case 1:
				clearInterval(iInterval)
				clearTimeout(iTimeout)
				this.setState({
					Countdown: false,
					timeNum: key,
					timeClose: false,
					setTimeNum: '',
					Timer: ''
				})
				break;
			case 7:
				this.alertTime(key)
				break;

			default:
				this.setTime(key, keyNum)

				break;
		}

	}
	alertTime = (key) => {
		const prompt = Modal.prompt;
		prompt('自定义关闭时间(分钟)', '', [
			{ text: '取消' },
			{
				text: '提交', onPress: value => {
					if (!value) {
						Toast.info('请输入时间')
						return false
					}
					this.setState({
						setTimeNum: value * 60000
					}, () => {
						this.setTime(key, this.state.setTimeNum)
					})
				}
			},
		], 'default', '')
	}
	setTime = (key, keyNum) => {
		clearTimeout(iTimeout)
		clearInterval(iInterval)
		this.ap.play()
		this.setState({
			Countdown: true,
			timeNum: key,
			timeClose: false,
		}, () => {
			iTimeout = setTimeout(() => {
				this.onPause()
				this.setState({
					Countdown: false,
					timeClose: false,
					timeNum: '',
					setTimeNum: '',
					Timer: ''
				})
			}, keyNum);
			iInterval = setInterval(() => {

				keyNum = keyNum - 1000
				this.formatDuring(keyNum)
				if (keyNum === 0) {
					clearInterval(iInterval)
				}
			}, 1000);
			// }, key*6000);
		})
	}
	copyShare = () => {
		const {id}=this.props.detailInfo
		const invitation_code=sessionStorage.getItem('invitation_code')
		if(id&&invitation_code){
			copy(window.location.href+'/'+id+'/'+invitation_code);
			Toast.info('分享链接已复制链接至粘贴板', 2, null, false)
			return false
		}
		Toast.info('请先登录')
	}
	onLoad = () => {
		this.setState({
			loaded: false
		})
	}
	setThumbed = () => {
		novel_thumbs({
			user_id: crypt(sessionStorage.getItem('user_id')),
			novel_id: this.props.detailInfo.id
		}).then(res => {
			const { code } = res
			if (code === 0) {
				Toast.info('点赞成功', 1, null, false)
				this.setState({
					thumbed: 1,
					thumb_num: this.state.thumb_num + 1
				})
				return false
			}
			Toast.info('已经点过赞了', 1, null, false)
		})
	}
	subMitShow = async () => {
		document.body.scrollTop = document.documentElement.scrollTop = 0
		this.setState({
			subMit: false,
			scrollHidden: false
		})
		this.scrollToAnchor('activity')
		setTimeout(async () => {
			this.setState({
				subMit: true,
			})
			this.setState({
				scrollHidden: true,
				bodyScroll: document.documentElement.scrollTop
			})
		}, 500);
		this.commentIpt.focus()
	}
	// subMitShow = async () => {
	// 	if (document.documentElement.scrollTop !== 0) {
	// 		document.body.scrollTop = document.documentElement.scrollTop = 0
	// 	}
	// 	// this.setState({
	// 	// 	subMit: false,
	// 	// 	scrollHidden: false
	// 	// })
	// 	const _this = this
	// 	this.scrollToAnchor('activity')
	// 		.then(async () => {
	// 			const u = navigator.userAgent, app = navigator.appVersion;
	// 			const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
	// 			const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	// 			const bodyListener = document.body
	// 			bodyListener.addEventListener ('scroll',() => {
	// 				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
	// 				console.log(scrollTop, _this.state.anchorElement );

	// 				if (scrollTop - _this.state.anchorElement > -30 && scrollTop - _this.state.anchorElement < 30) {
	// 					let timer
	// 					clearTimeout(timer)
	// 					timer = setTimeout(() => {
	// 						_this.setState({
	// 							subMit: true,
	// 							bodyScroll: scrollTop,
	// 							anchorElement: '',

	// 						}, () => {
	// 							if (isAndroid) {
	// 								_this.commentIpt.focus()
	// 							}
	// 							setTimeout(() => {
	// 								_this.setState({
	// 									scrollHidden: true,
	// 								})
	// 							}, 500);
	// 						})
	// 					}, 20);

	// 				}
	// 			})
	// 			if (isiOS) {
	// 				_this.commentIpt.focus()
	// 			}
	// 		})
	// }
	scrollToAnchor = async (anchorName) => {
		let anchorElement = document.getElementById(anchorName);
		setTimeout(() => {
			document.documentElement.scrollTop = document.body.scrollTop = anchorElement.offsetTop
		}, 20);
		// setTimeout(() => {
		// 	anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
		// 	this.setState({
		// 		anchorElement: anchorElement.offsetTop
		// 	}, () => console.log(anchorElement.offsetTop)
		// 	)
		// }, 20);
	}
	hiddenCommentIpt = () => {
		// console.log(1);
		// alert(1)
		const bodyScroll = this.state.bodyScroll
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		const countScrollTop = this.state.countScrollTop
		if (scrollTop - bodyScroll > 10 || scrollTop - bodyScroll < 10) {
			this.setState({
				countScrollTop: true
			})
		}
		if (countScrollTop) {
			if (scrollTop - bodyScroll < -10 || scrollTop - bodyScroll > 10) {
				this.commentIpt.blur()
			}
		}

	}
	// getRotate = (matrix) => {
	// 	var aa = Math.round(180 * Math.asin(matrix[0]) / Math.PI);
	// 	var bb = Math.round(180 * Math.acos(matrix[1]) / Math.PI);
	// 	var cc = Math.round(180 * Math.asin(matrix[2]) / Math.PI);
	// 	var dd = Math.round(180 * Math.acos(matrix[3]) / Math.PI);
	// 	var deg = 0;
	// 	if (aa == bb || -aa == bb) {
	// 		deg = dd;
	// 	} else if (-aa + bb == 180) {
	// 		deg = 180 + cc;
	// 	} else if (aa + bb == 180) {
	// 		deg = 360 - cc || 360 - dd;
	// 	}
	// 	return deg >= 360 ? 0 : deg;

	// }
	getTranslate = (node) => {//获取transform值
		var el = document.getElementById(node);
		if (!el) {
			return false
		}
		var st = window.getComputedStyle(el, null);
		var tr = st.getPropertyValue("-webkit-transform") ||
			st.getPropertyValue("-moz-transform") ||
			st.getPropertyValue("-ms-transform") ||
			st.getPropertyValue("-o-transform") ||
			st.getPropertyValue("transform") ||
			"FAIL";
		if (tr === 'none' || !tr || tr === '') {
			return false
		}
		// With rotate(30deg)...
		// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
		// console.log('Matrix: ' + tr);
		// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
		var values = tr.split('(')[1].split(')')[0].split(',');
		var a = values[0];
		var b = values[1];
		// var c = values[2];
		// var d = values[3];
		// var scale = Math.sqrt(a * a + b * b);
		// console.log('Scale: ' + scale);
		// arc sin, convert from radians to degrees, round
		// var sin = b / scale;
		// next line works for 30deg but not 130deg (returns 50);
		// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
		var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
		// console.log('Rotate: ' + angle + 'deg')
		// return 'Rotate: ' + angle + 'deg'
		this.setState({
			rotateZ: angle + 'deg'
		})
		// return angle + 'deg'
	}
	render() {
		const {
			state: {
				playerList,
				name,
				url,
				cover,
				show,
				detailShow,
				play,
				modal2,
				collected,
				collectedNum,
				commentTitle,
				dataSource,
				noMore,
				commentValue,
				timeClose,
				Countdown,
				timeNum,
				Timer,
				loaded,
				thumb_num,
				thumbed,
				subMit,
				commentList
			},
			props: {
				getBooKDetail
			},
			changeSrc,
			setCollect,
			onEndReached,
			changeCommentValue,
			commentSubMit,
			changePlay,
			setTimePlay,
			setTimeoutByPlay,
			copyShare,
			onLoad,
			setThumbed,
			subMitShow,
			// getTranslate
		} = this
		const guess = {
			getBooKDetail,
			loaded,
			onLoad
		}
		const player = {
			theme: '#F57F17',
			lrcType: 3,
			audio: [
				{
					name,
					url,
					cover,
					theme: '#ebd0c2'
				}
			]
		};
		// let commentInpuetShow
		// if (!modal2 || timeClose) {
		// 	commentInpuetShow = true
		// }
		const setTimeCloseList = [
			{
				title: '不开启',
				key: 1,
			}, {
				title: '10分钟后',
				key: 10,
			}, {
				title: '20分钟后',
				key: 20,
			}, {
				title: '30分钟后',
				key: 30,
			}, {
				title: '60分钟后',
				key: 60,
			}, {
				title: '90分钟后',
				key: 90,
			}, {
				title: '自定义时间',
				key: 7,
			}
		]
		return (
			<div className={detailShow ? 'playerDetail' : 'player'}>
				{
					detailShow && <>
						<div className="top">
							<div className="header">
								<img className='minimize' src={require('../../assets/images/back_btn.png')} alt="" onClick={() => {
									this.props.setDetailShow()
									this.props.closeMyLoginShow()
									this.setState({
										detailShow: !this.state.detailShow
									})

								}} />
								<div className="title">
									{this.props.novelTitle}-{this.state.serial}
								</div>
								<div className="Nothing" onClick={() => {
									copyShare()
								}}>
									<img src={require('../../assets/images/share_btn.png')} alt="" />
								</div>
							</div>
							<div className='record'>
								<div className="recordImg">
									<img src={require('../../assets/images/record_nomal.png')} alt="" />
									<img src={this.props.novelPoster} alt="" id='onPosterRotateZ' style={!play ? {
										color: '#fff',
										transform: `rotateZ(${this.state.rotateZ})`
									} : {}} className={play ? "onPoster" : "Poster"} />
								</div>
								<div className="playerBtn">
									<div className="img" onClick={() => {
										this.setState({
											modal2: !this.state.modal2
										})
									}}>
										<img src={modal2 ? require('../../assets/images/book_list_pressed.png') : require('../../assets/images/book_list_nomal.png')} alt="" />
									</div>
									<div className="img" onClick={() => {
										changePlay(-1)
									}}>
										<img src={require('../../assets/images/before_btn.png')} alt="" />
									</div>
									<div className="img" onClick={() => {
										this.ap.toggle()
									}} >
										<img src={play ? require('../../assets/images/pause_btn.png') : require('../../assets/images/play_btn.png')} alt="" />
									</div>
									<div className="img" onClick={() => {
										changePlay(1)
									}} >
										<img src={require('../../assets/images/nexy_btn.png')} alt="" />
									</div>
									<div className="img" onClick={() => {
										setTimePlay()
									}}>
										<img src={Countdown ? require('../../assets/images/time_pressed.png') : require('../../assets/images/time_nomal.png')} alt="" />
									</div>
								</div>
							</div>
						</div>
						<ListTitle title={this.props.novelTitle + '-' + this.state.serial} right={this.props.detailInfo.play} />
						<div className="itemBtn">
							<div className="left">
								<div className="like" onClick={() => {
									setThumbed()
								}}>
									<img src={thumbed ? require('../../assets/images/awesome_pressed_btn.png') : require('../../assets/images/awesome_nomal_btn.png')} alt="" />
									<p className={thumbed ? 'activeCollected' : ''}>{thumb_num}</p>
								</div>
								{/* <div className="comment_num" onClick={() => {
									// setCollect(this.props.detailInfo.id)
									getComment()

								}}>
									<img src={require('../../assets/images/view_comment_btn.png')} alt="" />
									<p>{comment_num}</p>
								</div> */}
								<div className="comment" onClick={() => {
									setCollect(this.props.detailInfo.id)

								}}>
									<img src={collected ? require('../../assets/images/comment_pressed_btn.png') : require('../../assets/images/comment_nomal_btn.png')} alt="" />
									<p className={collected ? 'activeCollected' : ''}>{collectedNum}</p>
								</div>
							</div>
							{/* <div className="right">
                                <div className="collected">
                                    <img src={this.props.detailInfo.collected ? require('../../assets/images/thumbnail_like_pressed_btn.png') : require('../../assets/images/user_favorite_btn.png')} alt="" />
                                </div>
                                <div className="share">
                                    <img src={require('../../assets/images/share_btn.png')} alt="" />
                                </div>
                            </div> */}
						</div>
						<div style={{
							width: '100%',
							margin:'.2rem 0 .1rem 0'
						}} onClick={() => {
							const w = window.open('about:blank');
							w.location.href = this.props.detailInfo.share_url;
							return false
						}}>
							<img style={{
								width: '100%',
								borderRadius: '.1rem'
							}} src={require('../../assets/images/banner-detail.png')} alt="下载广告" />
						</div>
						<ListTitle title={'猜你喜欢'} />
						{
							this.props.detailInfo.guess.map(e => {
								return <BookDetailGuess {...e} key={e.id} {...guess} />
							})
						}
						<Modal
							className='AudioModal'
							popup
							visible={modal2}
							title={"目录 (" + playerList.length + ') 章'}
							onClose={() => {
								this.setState({
									modal2: !this.state.modal2
								})
							}}
							animationType="slide-up"
						// afterClose={() => { alert('afterClose'); }}
						>
							{playerList.map(e => {
								return (
									<p className={e.serial === this.state.serialNum ? 'serialActive' : 'serial'} onClick={() => {
										changeSrc(e.src, e.serial)
									}} key={e.serial}>第{e.serial}章</p>
								)
							})}
						</Modal>
						{
							// eslint-disable-next-line
							modal2 || !timeClose && <div className="ipt" >
								<div className="icon">
									<img src={require('../../assets/images/comment_white_ico.png')} alt="" />
								</div>
								{!subMit && <div className='textarea' onClick={() => {
									subMitShow()
									// this.scrollToAnchor('activity')
								}}>我要说两句...</div>}
								<input type="text" placeholder='我要说两句' style={subMit ? { opacity: 1, flex: 1 } : { opacity: 0, width: '.1rem' }} name="" id="" value={commentValue} onChange={(e) => {
									changeCommentValue(e)
								}}
									onFocus={() => {
										// setTimeout(() => {
										// 	this.commentIpt.scrollIntoView(false);
										// }, 200);
										// this.scrollToAnchor('activity')
										// subMitShow()
									}}
									onBlur={() => {
										if (commentValue) {
											this.setState({
												scrollHidden: false
											})
											return false
										}
										this.setState({
											subMit: false,
											scrollHidden: false
										})
									}}
									ref={(commentIpt) => { this.commentIpt = commentIpt }}
								/>
								{
									subMit && <div className='subMitText' onClick={() => {
										commentSubMit(Date.now())
									}}>
										<span>发送</span>
									</div>
								}
							</div>
						}
						<div id='activity'>
							<ListTitle title={"热门评论 (" + commentTitle + ')'} />
						</div>
						<ListView
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const parameter = {
									rowData,
									type: 'book'
								}
								return (
									<CommentItem {...parameter} />

								)
							}}
							useBodyScroll={true}
							onScroll={this.state.scrollHidden ?
								this.hiddenCommentIpt : () => { }}
							// pullToRefresh={refresh ? <PullToRefresh
							// 	refreshing={isRefreshing}
							// 	onRefresh={onRefresh}
							// /> : ''}
							onEndReachedThreshold={1}
							onEndReached={onEndReached}
							// initialListSize={10}
							pageSize={10}
							renderFooter={() => {
								if (!commentList.length) {
									return (<div style={{ padding: '.3rem 0 .5rem 0', textAlign: 'center' }}>
										暂无评论
								</div>)
								}
								return (<div style={{ padding: '.3rem 0 .5rem 0', textAlign: 'center' }}>
									{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
								</div>)
							}}
						/>
						<Modal
							className='timeClose'
							popup
							visible={timeClose}
							title={'定时关闭'}
							onClose={() => {
								this.setState({
									timeClose: !this.state.timeClose
								})
							}}
							animationType="slide-up"
						// afterClose={() => { alert('afterClose'); }}
						>
							{
								setTimeCloseList.map(e => {
									return (
										<p key={e.key} className={timeNum === e.key ? 'timeList timeListActive' : 'timeList'} onClick={() => {
											setTimeoutByPlay(e.key)
										}}>
											{e.title}
										</p>
									)
								})
							}
						</Modal>
						{
							Countdown && (
								<div className='Timer'>
									{Timer}
								</div>
							)
						}
					</>
				}
				<div className="offPlaye" onClick={() => {
					this.onPause()
					// this.props.setDetailShow(0)
					clearTimeout(iTimeout)
					clearInterval(iInterval)
					clearTimeout(changeSrcTimer)
					this.setState({
						show: false
					})
				}}>
					<img src={require('../../assets/images/close_btn.png')} alt="" />
				</div>
				<div className="changeWindow" onClick={() => {
					this.props.setDetailShow()
					// this.props.closeMyLoginShow()
					this.setState({
						detailShow: !this.state.detailShow
					}, () => {
						document.body.scrollTop = document.documentElement.scrollTop = 0
						if (play) {
							const poster = document.getElementById('onPosterRotateZ')
							poster.className = 'Poster'
							setTimeout(() => {
								poster.className = 'onPoster'
							}, 20);
						}
					})
				}}>
				</div>
				{/* {
					this.state.serialShow && <div className='playerSerial'>
						{
							playerList.map(e => (
								<p className={this.state.serialNum === e.serial ? 'activeSerial' : ''} onClick={() => {
									this.setState({
										serial: `第${e.serial}集`
									})
									changeSrc(e.src, e.serial)
								}}>第{e.serial}集</p>
							))
						}
					</div>
				} */}
				{/* {
					!detailShow && <p className='select' onClick={() => {

						this.setState({
							serialShow: !this.state.serialShow
						}, () => {
							if (this.state.serialShow) {
								this.props.setOnRefresh(false)
							} else {
								this.props.setOnRefresh(true)
							}
						})
					}} >选集</p>
				} */}
				{show && <ReactAplayer
					{...player}
					onInit={this.onInit}
					onPlay={this.onPlay}
					onPause={this.onPause}
					onEnded={() => {
						changePlay(1)

					}}
				/>}

			</div>
		);
	}
}
export default App
