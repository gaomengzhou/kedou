import { ListView, Modal, Toast } from 'antd-mobile';
import copy from 'copy-to-clipboard';
import React from 'react';
import ReactAplayer from 'react-aplayer';
import { withRouter } from 'react-router-dom';
import { collect, comment, comment_add } from '../../services/book';
import BookDetailGuess from '../BookDetailGuess';
import CommentItem from '../CommentItem';
import ListTitle from '../ListTitle';
import './index.scss';
let iTimeout;
let iInterval;
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
			setTimeNum: ''
		}
	}
	componentDidMount() {
		this.setState({
			collected: this.props.detailInfo.collected,
			name: this.props.novelTitle,
			url: this.props.player.src,
			cover: this.props.novelPoster,
			show: true,
			collectedNum: this.props.detailInfo.love,
		}, () => {
			document.querySelector('.aplayer-author').innerHTML = '第1集'
			document.querySelector('.aplayer-icon-loop').remove()
			document.body.scrollTop = document.documentElement.scrollTop = 0
		})
	}
	componentWillUnmount() {
		this.onPause()
		// document.querySelector('.playerDetail').addEventListener("touchmove", (e) => {
		//  // 执行滚动回调
		//  this.sidebarTouchMove(e)
		//   }, {
		//  passive: false //  禁止 passive 效果
		//   })
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
		await this.setState({
			show: false
		})
		await this.setState({
			url,
			show: true,
			serialShow: false
		}, () => {
			document.querySelector('.aplayer-author').innerHTML = `第${num}集`
			document.querySelector('.aplayer-icon-loop').remove()
			this.setState({
				serialNum: num,
				serial: `第${num}集`,
				modal2: false
			}, () => {
				if (!this.state.play) {
					setTimeout(() => {
						this.ap.toggle()
					}, 1000);
				}
			})
		})
	}
	sidebarTouchMove(e) {
		e.preventDefault();
	}
	setCollect = (novel_id) => {
		collect({
			user_id: sessionStorage.getItem('user_id'),
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
				Toast.info(res.err, 1, null, false)
			}
		})
	}


	getComment = () => {
		if(!this.state.commentShow){
			return false
		}
		comment({
			user_id: sessionStorage.getItem('user_id'),
			novel_id: this.props.detailInfo.id,
			page: 1,
			rows: 10
		}).then(res => {
			this.setState({
				commentShow: false,
				commentTitle: res.total,
				commentList: res.list,
				dataSource: this.state.dataSource.cloneWithRows(res.list),
			})
		})
	}
	concatList = () => {
		const list = this.state.commentList
		comment({
			user_id: sessionStorage.getItem('user_id'),
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
	commentSubMit = (e) => {
		if (e.keyCode === 13) {
			this.showAlert()
		}
	}
	showAlert = () => {
		const commentValue = this.state.commentValue
		const alert = Modal.alert;
		if (!commentValue) {
			Toast.info('请输入评论内容')
			return false
		}
		this.commentIpt.blur()

		const alertInstance = alert('发送评论', '', [
			{ text: '取消' },
			{
				text: '发送', onPress: () => {
					comment_add({
						user_id: sessionStorage.getItem('user_id'),
						novel_id: this.props.detailInfo.id,
						message: commentValue
					}).then(res => {
						if (res.code === 0) {
							Toast.info(res.suc)
							this.setState({
								commentValue: '',
								commentShow: true
							})
						} else {
							Toast.info(res.err)
						}

					})
				}
			},
		]);
		setTimeout(() => {
			// 可以调用close方法以在外部close
			alertInstance.close();
		}, 10000);
	};
	changePlay = (num) => {
		const {
			state: {
				playerList,
				serialNum
			},
			changeSrc
		} = this
		if (serialNum === 1 && num === -1) {
			Toast.info('已经是第一集了')
			this.onPause()
			return false
		}
		if (serialNum === playerList.length && num === 1) {
			Toast.info('已经是最后一集了')
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
		// var days = parseInt(mss / (1000 * 60 * 60 * 24));
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
		copy(this.props.detailInfo.share_url);
		Toast.info('已复制链接至粘贴板')
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
				commentShow,
				commentTitle,
				dataSource,
				noMore,
				commentValue,
				timeClose,
				Countdown,
				timeNum,
				Timer,
			},
			props: {
				getBooKDetail
			},
			changeSrc,
			setCollect,
			getComment,
			onEndReached,
			changeCommentValue,
			commentSubMit,
			changePlay,
			setTimePlay,
			setTimeoutByPlay,
			copyShare
		} = this
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
									<img src={this.props.novelPoster} alt="" className="Poster" />
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
								{/* <div className="like">
                                    <img src={require('../../assets/images/awesome_nomal_btn.png')} alt="" />
                                    <p>{this.props.detailInfo.love}</p>
                                </div> */}
								<div className="comment" onClick={() => {
									setCollect(this.props.detailInfo.id)

								}}>
									<img src={collected ? require('../../assets/images/comment_pressed_btn.png') : require('../../assets/images/comment_nomal_btn.png')} alt="" />
									<p>{collectedNum}</p>
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
						<ListTitle title={'猜你喜欢'} />
						{
							this.props.detailInfo.guess.map(e => <BookDetailGuess {...e} getBooKDetail={getBooKDetail} />)
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
								if (e.serial === this.state.serialNum) {
									return (
										<p className='serialActive' onClick={() => {

											changeSrc(e.src, e.serial)
										}}>第{e.serial}集</p>
									)
								}
								return (
									<p className='serial' onClick={() => {
										changeSrc(e.src, e.serial)
									}}>第{e.serial}集</p>
								)
							})}
						</Modal>
						{
							// eslint-disable-next-line
							modal2 || !timeClose && <div className="ipt" onClick={() => {
								getComment()
							}}>
								<div className="icon">
									<img src={require('../../assets/images/comment_white_ico.png')} alt="" />
								</div>
								<textarea type="text" placeholder='我要说两句' name="" id="" value={commentValue} onChange={(e) => {
									changeCommentValue(e)
								}}
									ref={(commentIpt) => { this.commentIpt = commentIpt }}
									onKeyDown={(e) => {
										commentSubMit(e)
									}} />
							</div>
						}
						<Modal
							className='commentModal'
							popup
							visible={!commentShow}
							title={"评论 (" + commentTitle + ')'}
							onClose={() => {
								this.setState({
									commentShow: !this.state.commentShow
								})
							}}
							animationType="slide-up"
						// afterClose={() => { alert('afterClose'); }}
						>

							<ListView
								dataSource={dataSource}
								pageSize={10}
								renderRow={(rowData, sectionID, rowID) => {
									const parameter = {
										rowData,
									}
									return (
										<CommentItem {...parameter} />

									)
								}}
								// useBodyScroll={true}
								onEndReachedThreshold={10}
								onEndReached={onEndReached}
								renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
									{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
								</div>)}
							/>
						</Modal>
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
									if (timeNum === e.key) {
										return (
											<p key={e.key} className='timeList timeListActive' onClick={() => {
												setTimeoutByPlay(e.key)
											}}>
												{e.title}
											</p>
										)
									}

									return (
										<p key={e.key} className='timeList' onClick={() => {
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
				{
					this.state.serialShow && <div className='playerSerial'>
						{
							playerList.map(e => (
								<p onClick={() => {
									this.setState({
										serial: `第${e.serial}集`
									})
									changeSrc(e.src, e.serial)
								}}>第{e.serial}集</p>
							))
						}
					</div>
				}
				{
					!detailShow && <p className='select' onClick={() => {
						this.setState({
							serialShow: !this.state.serialShow
						})
					}} >选集</p>
				}
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
