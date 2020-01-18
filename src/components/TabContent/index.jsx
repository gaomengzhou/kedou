import React, { Component } from 'react';
import { PullToRefresh, ListView, Carousel } from 'antd-mobile';
import ListTitle from '../ListTitle'
import ListContent from '../ListContent'
import { connect } from 'react-redux'
import { getHomeVideoList } from '@/store/action/video'
import { getTabList, search_video } from '../../services/video'
import { bannel_list } from '../../services/bannel'
const stateToProps = (state) => {
	return {
		tabList: state.video.tabList,
	}
}
const mapDispatchToProps = {
	getHomeVideoList
};
@connect(
	stateToProps,
	mapDispatchToProps,
)
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			noMore: false,
			isRefreshing: true,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			videoList: [],
			page: 1,
			data: '',
			scroll: false,
			bannel: []

		}
	}
	async componentDidMount() {
		await bannel_list({
			type: 1
		}).then(res => {
			this.setState({
				bannel: res
			})

		})
		await this.onRefresh()

	}
	static getDerivedStateFromProps(props, state) {
		const {
			recommend,
			hotLabel,
			newVideoList,
			hotVideoList
		} = props
		switch (props.tab.title) {
			case '全部影片': {
				return {
					videoList: {
						recommend,
						hotLabel,
						newVideoList,
						hotVideoList,
					}
				}
			} case '最新片源': {
				return {
					videoList: newVideoList
				}
			} case '重磅热播': {
				return {
					videoList: hotVideoList
				}
			}
			default: {
				return null
			}
		}
	}

	onRefresh = async () => {
		await this.setState({
			isRefreshing: true
		})
		switch (this.props.tab.title) {
			case '全部影片': {
				await this.props.getHomeLabelList({
					type: 0
				})
				break;
			}
			case '最新片源': {
				await this.props.getHomeVideoList({
					rows: ''
				})
				break;
			}
			case '重磅热播': {
				await this.props.getHomeVideoList({
					rows: ''
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
						videoList: res
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
						videoList: res
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
						dataSource: this.state.dataSource.cloneWithRows(videoList),
					})
				})
			}
		}

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
			isLoading: false,
			data: Date.now()
		})
		loading = false
	}

	recommendCallBack = (e) => {
		//console.log(e);

	}
	newCallBack = (e) => {
		//console.log(e);

	}
	mostCallBack = (e) => {
		//console.log(e);

	}
	scrollTopChange = (e) => {
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		console.log(e, scrollTop);

	}

	scrollDirect = () => {
		const _this = this
		var beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop
		window.addEventListener("scroll", function () {
			var afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
				delta = afterScrollTop - beforeScrollTop;
			if (delta === 0) return false;
			const scroll = delta > 0 ? "down" : "up"
			const stateScroll = _this.state.scroll
			if (document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.header-search') && document.querySelector('.background') && document.querySelector('.am-tab-bar-bar')) {
				if (afterScrollTop > 150) {
					if (scroll !== stateScroll || !stateScroll) {
						if (scroll === 'down' && afterScrollTop > 100) {
							document.querySelector('.am-tabs-tab-bar-wrap').style.top = '-2rem'
							document.querySelector('.header-search').style.top = '-2rem'
							document.querySelector('.background').style.top = '-2rem'
							document.querySelector('.am-tab-bar-bar').style.bottom = '-2rem'
						} else {
							document.querySelector('.background').style.top = '0rem'
							document.querySelector('.header-search').style.top = '0rem'
							document.querySelector('.am-tabs-tab-bar-wrap').style.top = '1rem'
							document.querySelector('.am-tab-bar-bar').style.bottom = '0'
						}
						_this.setState({
							scroll: delta > 0 ? "down" : "up"
						})
					}
				}
			} else {
				return null
			}
			beforeScrollTop = afterScrollTop;
		}, false);
	}
	listHeader = () => {
		if(this.state.bannel.length===0){
			return false
		}
		return (
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
						/>
					))}
				</Carousel>
		)
	}
	render() {
		const {
			state: {
				dataSource,
				isRefreshing,
				noMore
			},
			onRefresh,
			onEndReached,
			listHeader
		} = this
		const contentStyle = {
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row'
			// justifyContent:'left'
		}
		switch (this.props.tab.title) {
			case '全部影片': {
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
						onScroll={() => {
							if (document.querySelector('.background') && document.querySelector('.header-search') && document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.am-tab-bar-bar')) {
								this.scrollDirect()
							} else {
								return false
							}
						}
						}
						scrollEventThrottle={11111111110}
						renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
							{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
						</div>)}
					/>
				)
			} case '最新片源': {
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
							renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
							</div>)}
						/>
					</div>
				)
			} case '重磅热播': {
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
							renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
							</div>)}
						/>
					</div>
				)
			} default: {
				return (
					<div className="tabsList">
						<ListView
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									goToVideoDetail: this.props.goToVideoDetail,
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
							renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
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