 /**
 * @description video页面 list组件 基于ant tab组件 包含下拉刷新 上拉加载
 * @memberof tabs
 * @time 2020/1/7
 * @author Aiden
 */
import React, { Component } from 'react';
import { PullToRefresh, ListView, Carousel } from 'antd-mobile';
import ListTitle from '../ListTitle'
import ListContent from '../ListContent'
import { connect } from 'react-redux'
import { getHomeVideoList, goBackList as goBackListFN } from '../../store/action/video'
import { getTabList, search_video } from '../../services/video'
import { bannel_list } from '../../services/bannel'
import { withRouter } from 'react-router-dom';
import HomeSettimeoutClose from '../HomeSettimeoutClose'
const stateToProps = (state) => {
	return {
		scrollTop: state.video.scrollTop,
		tabList: state.video.tabList,
		goBackList: state.video.goBackList,
		tabAction: state.video.tabAction
	}
}
const mapDispatchToProps = {
	getHomeVideoList,
	goBackListFN
};
@connect(
	stateToProps,
	mapDispatchToProps,
)
@withRouter
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			noMore: false,
			isRefreshing: true,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			videoList: [],
			page: 1,
			data: '',
			scroll: false,
			bannel: [],

		}
	}
	async componentDidMount() {
		//获取首页轮播图
		await bannel_list({
			type: 1
		}).then(res => {
			this.setState({
				bannel: res,
				isLoading: true,
			})

		})

		await this.onRefresh()
	}
	//获取首页列表
	static getDerivedStateFromProps(props, state) {
		let {
			recommend,
			hotLabel,
			newVideoList,
			hotVideoList
		} = props
		switch (props.tab.title) {
			case props.labelList[0].title: {
				newVideoList = newVideoList.slice(0, 10)
				hotVideoList = hotVideoList.slice(0, 10)
				return {
					videoList: {
						recommend,
						hotLabel,
						newVideoList,
						hotVideoList,
					}
				}
			} case props.labelList[1].title: {
				return {
					videoList: newVideoList
				}
			} case props.labelList[2].title: {
				return {
					videoList: hotVideoList
				}
			}
			default: {
				return null
			}
		}
	}
	//下拉
	onRefresh = async () => {
		if (this.props.tab.title === this.props.tabAction) {
			if (this.props.goBackList && this.props.goBackList.videoList.length) {
				await this.setState({
					...this.props.goBackList,
					dataSource: this.state.dataSource.cloneWithRows(this.props.goBackList.videoList),
				}, () => {
					document.body.scrollTop = document.documentElement.scrollTop = this.props.scrollTop
					this.props.goBackListFN('')
				})
				return false
			}
		}
		if (this.state.noRe) {
			return false
		}
		// document.body.scrollTop= document.documentElement.scrollTop=0
		await this.setState({
			isRefreshing: true,
			isLoading: true,
		})
		switch (this.props.tab.title) {
			case this.props.labelList[0].title: {
				await this.props.getHomeLabelList({
					type: 0
				})
				await this.setState({
					isLoading: false,
				})
				break;
			}
			case this.props.labelList[1].title: {
				await this.props.getHomeVideoList({
					rows: 20
				})
				await this.setState({
					isLoading: false,
				})
				break;
			}
			case this.props.labelList[2].title: {
				await this.props.getHomeVideoList({
					rows: 20
				})
				await this.setState({
					isLoading: false,
				})
				break;
			}
			case this.props.labelList[3].title: case this.props.labelList[4].title: case this.props.labelList[5].title: case this.props.labelList[6].title: {
				await search_video({
					page: 1,
					rows: 20,
					id: this.props.tab.id
				}).then(res => {

					this.setState({
						videoList: res,
						isLoading: false,
					})
				})
				break;
			}

			default: {
				await getTabList({
					page: 1,
					rows: 20,
					label: this.props.tab.title
				}).then(res => {
					this.setState({
						videoList: res,
						isLoading: false,
					})

				})
			}
		}
		const videoList = await JSON.parse(JSON.stringify(this.state.videoList))
		await this.setState({
			videoList,
			page: 1,
			isRefreshing: false,
			dataSource: this.state.dataSource.cloneWithRows(videoList),
			noMore: false,
			data: Date.now()
		})
	}
	//拼接
	concatList = () => {
		const list = this.state.videoList
		switch (this.props.tab.title) {
			case this.props.labelList[3].title: case this.props.labelList[4].title: case this.props.labelList[5].title: case this.props.labelList[6].title: {
				search_video({
					page: this.state.page + 1,
					rows: 20,
					id: this.props.tab.id
				}).then(res => {

					if (res.length === 0) {
						this.setState({
							noMore: true
						})
						return
					}
					const videoList = list.concat(res)
					this.setState({
						videoList,
						page: this.state.page + 1,
						rows: 20,
						dataSource: this.state.dataSource.cloneWithRows(videoList),
					})
				})
				break;
			}
			default: {
				getTabList({
					page: this.state.page + 1,
					rows: 20,
					label: this.props.tab.title
				}).then(res => {
					if (res.length === 0) {
						this.setState({
							noMore: true
						})
						return
					}

					const videoList = list.concat(res)
					this.setState({
						videoList,
						page: this.state.page + 1,
						rows: 20,
						isLoading: false,
						dataSource: this.state.dataSource.cloneWithRows(videoList),
					})
				})
			}
		}

	}
	//上拉
	onEndReached = () => {
		if (this.props.tab.title === this.props.tabAction) {
			if (this.props.goBackList && this.props.goBackList.videoList.length) {
				return false
			}
		}
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
			isLoading: false,
			data: Date.now()
		})
		loading = false
	}

	// recommendCallBack = (e) => {
	// 	//console.log(e);

	// }
	// newCallBack = (e) => {
	// 	//console.log(e);

	// }
	// mostCallBack = (e) => {
	// 	//console.log(e);

	// }
	// scrollDirect = () => {
	// 	const _this = this
	// 	var beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop
	// 	window.addEventListener("scroll", function () {
	// 		var afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
	// 			delta = afterScrollTop - beforeScrollTop;
	// 		if (delta === 0) return false;
	// 		const scroll = delta > 0 ? "down" : "up"
	// 		const stateScroll = _this.state.scroll
	// 		if (document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.header-search') && document.querySelector('.background') && document.querySelector('.TabBer')) {
	// 			if (afterScrollTop > 150) {
	// 				if (scroll !== stateScroll || !stateScroll) {
	// 					if (scroll === 'down' && afterScrollTop > 100) {
	// 						document.querySelector('.am-tabs-tab-bar-wrap').style.top = '-1rem'
	// 						document.querySelector('.header-search').style.top = '-2rem'
	// 						document.querySelector('.background').style.top = '-2rem'
	// 						document.querySelector('.TabBer').style.bottom = '-2rem'
	// 						_this.props.closeMyLoginShow()
	// 					} else {
	// 						document.querySelector('.background').style.top = '0rem'
	// 						document.querySelector('.header-search').style.top = '0rem'
	// 						document.querySelector('.am-tabs-tab-bar-wrap').style.top = '1rem'
	// 						document.querySelector('.TabBer').style.bottom = '0'
	// 					}
	// 					_this.setState({
	// 						scroll: delta > 0 ? "down" : "up"
	// 					})
	// 				}
	// 			} else {
	// 				document.querySelector('.background').style.top = '0rem'
	// 				document.querySelector('.header-search').style.top = '0rem'
	// 				document.querySelector('.am-tabs-tab-bar-wrap').style.top = '1rem'
	// 				document.querySelector('.TabBer').style.bottom = '0'
	// 			}
	// 		} else {
	// 			return null
	// 		}
	// 		beforeScrollTop = afterScrollTop;
	// 	}, false);
	// }
	//首页bannel和广告
	listHeader = () => {
		if (this.state.bannel.length === 0) {
			return false
		}
		return (
			<>
				<HomeSettimeoutClose /> 
				<Carousel
					autoplay={true}
					infinite={true}
					selectedIndex={0}
				>
					{this.state.bannel.map(val => (
						<img
							src={val.url}
							alt="正在加载图片"
							style={{ width: '100%', height: '100%' }}
							onClick={() => {
								if (/^(http|https)/.test(val.h5_target)) {
									// window.location.href=val.h5_target
									const w = window.open('about:blank');
									w.location.href = val.h5_target;
									return false
								}

								this.props.history.push(val.h5_target)
							}}
						/>
					))}
				</Carousel>
			</>
		)
	}
	//获取当前列表页状态 详情页返回时//缓存
	onClickasd = () => {
		return this.props.tab.title === this.props.tabAction ? {
			title: this.props.tab.title,
			isLoading: this.state.isLoading,
			videoList: this.state.videoList,
			isRefreshing: this.state.isRefreshing,
			noMore: this.state.noMore,
			page: this.state.page
		} : null
	}
	//防抖
	throttle = (fn, delay) => {
		var lastTime = 0
		return function () {
			var nowTime = Date.now()
			var space = nowTime - lastTime
			if (space >= delay) {
				fn()
				lastTime = Date.now()
			}
		}
	}
	render() {
		const {
			state: {
				dataSource,
				isRefreshing,
				noMore,
			},
			onRefresh,
			onEndReached,
			listHeader,
			throttle
		} = this
		const contentStyle = {
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row'
			// justifyContent:'left'
		}
		switch (this.props.tab.title) {
			case this.props.labelList[0].title: {
				return (
					<ListView
						dataSource={dataSource}
						renderHeader={() => listHeader()}
						renderRow={(rowData, sectionID, rowID) => {
							return (
								<>
									{rowID === 'recommend' &&
										<>
											<	ListTitle title={'推荐'} />
											<div style={contentStyle}>
												{rowData.map((ev, i) => {
													const info = {
														ev,
														rowID,
														changeActionKey: this.props.changeActionKey,
														title: this.props.tab.title
													}
													return (
														<ListContent key={i} {...info} />
													)
												})}
											</div>
										</>

									}
									<div>
										{
											rowID === 'hotLabel' && <>
												<	ListTitle title={'热门标签'} />
												<div style={{
													flexWrap: 'wrap',
													...contentStyle
												}}>
													{
														rowData.map((ev, i) => {
															const info = {
																ev,
																rowID,
																changeActionKey: this.props.changeActionKey,
																title: this.props.tab.title
															}
															return (
																<ListContent key={i} {...info} />
															)
														})
													}
												</div>
											</>
										}
									</div>
									{
										(rowID === 'newVideoList' || rowID === 'hotVideoList') && <>
											<ListTitle title={rowID === 'newVideoList' ? '最新片源' : '重磅热播'} more={true} changeActionKey={this.props.changeActionKey} />
											<div style={{
												flexWrap: 'wrap',
												...contentStyle
											}}>
												{
													rowData.map((ev, i) => {
														const info = {
															ev,
															rowID,
															goToVideoDetail: this.props.goToVideoDetail,
															onClickasd: this.onClickasd,
															title: this.props.tab.title
														}
														return (<ListContent key={i} {...info} />)
													})
												}
											</div>
										</>
									}
								</>
							)
						}}
						useBodyScroll={true}
						pullToRefresh={<PullToRefresh
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>}
						onScroll={throttle(() => {
							this.props.closeMyLoginShow()
						}, 1000)}
						// onScroll={() => {
						// 	if (document.querySelector('.background') && document.querySelector('.header-search') && document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.TabBer')) {
						// 		this.scrollDirect()
						// 	} else {
						// 		return false
						// 	}
						// }
						// }
						scrollEventThrottle={11111111110}
						renderFooter={() => (<div style={{ padding: '.3rem 0 1rem 0', textAlign: 'center' }}>
							{this.state.isLoading ? 'Loading...' : '没有更多了'}
						</div>)}
					/>
				)
			} case this.props.labelList[1].title: {
				return (
					<div className='newVideoListView'>
						<ListView
							style={{
								// height: ,height: 'calc(100vh - 2.2rem)'
								padding: '43.5px 0',
							}}
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									goToVideoDetail: this.props.goToVideoDetail,
									onClickasd: this.onClickasd,
									title: this.props.tab.title
								}
								return (
									<>
										<ListContent key={rowData.id} {...info} />
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={<PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/>}
							initialListSize={20}
							pageSize={20}
							renderFooter={() => (<div style={{ padding: '.3rem 0 1rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : <div className='ChangeList' onClick={() => {
									onRefresh()
									document.body.scrollTop = document.documentElement.scrollTop = 0
								}} >
									换一批
									</div>}
							</div>)}
						/>
					</div>
				)
			} case this.props.labelList[2].title: {
				return (
					<div className='newVideoListView'>
						<ListView
							style={{
								// height: ,height: 'calc(100vh - 2.2rem)'
								padding: '43.5px 0',
							}}
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									goToVideoDetail: this.props.goToVideoDetail,
									onClickasd: this.onClickasd,
									title: this.props.tab.title
								}
								return (
									<>
										<ListContent key={rowData.id} {...info} />
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={<PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/>}
							initialListSize={20}
							pageSize={20}
							renderFooter={() => (<div style={{ padding: '.3rem 0 1rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : <div className='ChangeList' onClick={() => {
									onRefresh()
									document.body.scrollTop = document.documentElement.scrollTop = 0
								}} >
									换一批
									</div>}
							</div>)}
						/>
					</div>
				)
			} default: {
				return (
					<div className="tabsList">
						<ListView
							initialListSize={
								1000
							}
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									goToVideoDetail: this.props.goToVideoDetail,
									onClickasd: this.onClickasd,
									title: this.props.tab.title
								}
								return (
									<>
										<ListContent key={rowData.id} {...info} />
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={<PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/>}
							onEndReachedThreshold={10}
							onEndReached={onEndReached}
							pageSize={10}
							renderFooter={() => (<div style={{ padding: '.3rem 0 1rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
							</div>)}
						/>
					</div>
				)
			}
		}
	}
}

export default index;