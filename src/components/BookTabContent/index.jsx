/**
 * @description  book页面 list组件 基于ant tab组件 包含下拉刷新 上拉加载
 * @memberof tabs
 * @time 2020/1/31
 * @author Aiden
 */
import { crypt } from '../../utils/base'
import React, { Component } from 'react';
import { PullToRefresh, ListView, Carousel } from 'antd-mobile';
// import { PullToRefresh, ListView } from 'antd-mobile';
import { bookList as getBookList } from '../../services/book'
import BookListContent from '../BookListContent'
import ListTitle from '../ListTitle'
// import { bannel_list } from '../../services/bannel'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import HomeSettimeoutClose from '../HomeSettimeoutClose'
const stateToProps = (state) => {
	return {
		refresh: state.book.refresh,
		bannelList: state.bannel.bannelList,
	}
}
@connect(
	stateToProps,
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
			bookList: [],
			headerImg: true
		}
	}

	componentDidMount() {
		// await bannel_list({
		// 	type: 1
		// }).then(res => {
		// 	console.log(res);

		// 	this.setState({
		// 		bannel: res,
		// 	})

		// })
		this.onRefresh()
	}
	//下拉
	onRefresh = async () => {
		await this.setState({
			isRefreshing: true,
			isLoading: true,
		})
		switch (this.props.tab.title) {
			case this.props.tabList[0].title: {
				let newList;
				let hotList;
				let obj;
				await getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: 1,
					rows: 18,
					order: "created_date",
					sort: "created_date"
				}).then(res => {
					newList = res
				})
				await getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: 1,
					rows: 18,
					order: "play",
				}).then(ret => {
					hotList = ret
					obj = {
						newList,
						hotList
					}
				})
				await this.setState({
					bookList: obj,
					isLoading: false,
				})
				break;
			}
			case this.props.tabList[1].title: {
				await getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: 1,
					rows: 21,
					order: "created_date",
					sort: "created_date"
				}).then(res => {
					this.setState({
						bookList: res,
						isLoading: false,
					})
				})
				break
			}
			case this.props.tabList[2].title: {
				await getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: 1,
					rows: 21,
					order: "play",
				}).then(res => {
					this.setState({
						bookList: res,
						isLoading: false,
					})
				})
				break
			}
			default: {
				await getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: 1,
					rows: 21,
					category_id: this.props.tab.category_id
				}).then(res => {
					this.setState({
						bookList: res,
						isLoading: false,
					})

				})
			}
		}
		const bookList = await JSON.parse(JSON.stringify(this.state.bookList))

		await this.setState({
			bookList,
			page: 1,
			isRefreshing: false,
			dataSource: this.state.dataSource.cloneWithRows(bookList),
			noMore: false,
		})
	}
	//拼接
	concatList = () => {
		const list = this.state.bookList
		switch (this.props.tab.title) {
			case this.props.tabList[1].title: {
				getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: this.state.page + 1,
					rows: 18,
					order: "created_date",
					sort: "created_date"
				}).then(res => {
					if (res.length === 0) {
						this.setState({
							noMore: true
						})
						return
					}
					const bookList = list.concat(res)
					this.setState({
						bookList,
						page: this.state.page + 1,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
			}
			case this.props.tabList[2].title: {
				getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: this.state.page + 1,
					rows: 18,
					order: "play",
				}).then(res => {
					if (res.length === 0) {
						this.setState({
							noMore: true
						})
						return
					}
					const bookList = list.concat(res)
					this.setState({
						bookList,
						page: this.state.page + 1,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
			}
			default: {
				getBookList({
					user_id: sessionStorage.getItem('user_id') ? crypt(sessionStorage.getItem('user_id')) : '',
					page: this.state.page + 1,
					rows: 18,
					category_id: this.props.tab.category_id
				}).then(res => {
					if (res.length === 0) {
						this.setState({
							isLoading: false,
							noMore: true
						})
						return
					}
					const bookList = list.concat(res)
					this.setState({
						bookList,
						page: this.state.page + 1,
						isLoading: false,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
			}
		}

	}
	//上拉加载更多
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
		// this.setState({
		// 	isLoading: false
		// })
		loading = false
	}
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
	// 			}else {
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
	// settimeoutClose=(e)=>{
	// 	e.stopPropagation()
	// 	const date=localStorage.getItem('settimeoutClose')
	// 	const oldDate=Date.now()
	// 	if(date){
	// 		if(date-oldDate>7200000){
	// 			this.setState({
	// 				headerImg:true
	// 			})
	// 			return false
	// 		}
	// 		this.setState({
	// 			headerImg:false
	// 		})
	// 		return false
	// 	}
	// 	localStorage.setItem('settimeoutClose',Date.now())
	// 	return false
	// }
	//头部bannel和广告
	listHeader = () => {
		const {
			bannelList
		} = this.props

		if (!bannelList) {
			return false
		}
		if (!bannelList.length) {
			if (this.props.tab.title === this.props.tabList[0].title) {
				if (document.querySelector('.am-pull-to-refresh-indicator')) {
					document.querySelector('.am-pull-to-refresh-indicator').style.marginTop = 0
				}
			}
			// document.querySelector('.am-pull-to-refresh-indicator').style.marginTop=0

			return false
		}
		return (
			<>
				<HomeSettimeoutClose type={'book'} hour={3} />
				<Carousel
					autoplay={true}
					infinite={true}
					selectedIndex={0}
				>
					{bannelList.map(val => (
						<img
							src={val.url}
							alt="正在加载图片"
							style={{ width: '100%', height: '100%' }}
							key={val.url}
							onClick={() => {
								if (/^(http|https)/.test(val.h5_target)) {
									// window.location.href=val.h5_target
									const w = window.open('about:blank');
									w.location.href = val.h5_target;
									return false
								}
								// window.location.href=`https://www.baidu.com`
								// // const w = window.open('about:blank');
								// // w.location.href=`https://www.baidu.com`;
								this.props.history.push(val.h5_target)
							}}
						/>
					))}
				</Carousel>
			</>
		)
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
			props: {
				getBooKDetail,
				testRightCallBack,
				refresh,
			},
			onRefresh,
			onEndReached,
			listHeader,
			throttle
		} = this

		const contentStyle = {
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row',
			flexWrap: 'wrap'
			// justifyContent:'left'
		}
		switch (this.props.tab.title) {
			case this.props.tabList[0].title: {
				return (
					<div id="bookHomeList" style={{
						paddingTop: '.5rem'
					}}>
						{/* {
							listHeader()
						} */}
						<ListView
							dataSource={dataSource}
							renderHeader={() => listHeader()}
							renderRow={(rowData, sectionID, rowID) => {
								return (
									<>
										{rowID === 'newList' &&
											<>
												<	ListTitle title={'最新小说'} more={true} changeActionKey={this.props.changeActionKey} />
												<div style={contentStyle}>
													{rowData.map((ev, i) => {
														const info = {
															ev,
															rowID,
															getBooKDetail,
															testRightCallBack
															// setCollect,
															// collectSucceed
														}
														return (
															<BookListContent key={i} {...info} />
														)
													})}
												</div>
											</>

										}
										{rowID === 'hotList' &&
											<>
												<	ListTitle title={'最热小说'} more={true} changeActionKey={this.props.changeActionKey} />
												<div style={contentStyle}>
													{rowData.map((ev, i) => {
														const info = {
															ev,
															rowID,
															getBooKDetail,
															testRightCallBack
															// setCollect,
															// collectSucceed
														}
														return (
															<BookListContent key={i} {...info} />
														)
													})}
												</div>
											</>

										}
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={refresh ? <PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/> : ''}
							// onEndReachedThreshold={10}
							// onScroll={() => {
							// 	if (document.querySelector('.background') && document.querySelector('.header-search') && document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.TabBer')) {
							// 		this.scrollDirect()
							// 	} else {
							// 		return false
							// 	}
							// }
							// }
							onScroll={throttle(() => {
								this.props.closeMyLoginShow()
							}, 1000)}
							scrollEventThrottle={11111111110}
							// onEndReached={onEndReached}
							// renderFooter={() => (<div style={{ padding: '.3rem 0 1.5rem 0', textAlign: 'center' }}>
							renderFooter={() => (<div style={document.querySelector('.player') ? { padding: '.3rem 0 2rem 0', textAlign: 'center' } : { padding: '.3rem 0 1.5rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : '没有更多了'}
							</div>)}
						/>
					</div>
				)
			}
			case this.props.tabList[1].title: case this.props.tabList[2].title: {
				return (
					<div className="tabsList" style={{
						paddingTop: '.5rem'
					}}>
						<ListView
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									getBooKDetail,
									testRightCallBack
									// setCollect,
									// collectSucceed
								}
								return (
									<>
										<BookListContent key={rowData.id} {...info} />
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={refresh ? <PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/> : ''}
							onEndReachedThreshold={10}
							onEndReached={onEndReached}
							initialListSize={21}
							pageSize={21}
							renderFooter={() => (<div style={document.querySelector('.player') ? { padding: '.3rem 0 2rem 0', textAlign: 'center' } : { padding: '.3rem 0 1.5rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
							</div>)}
						/>
					</div>
				)
			}
			default: {
				return (
					<div className="tabsList" style={{
						paddingTop: '.5rem'
					}}>
						<ListView
							dataSource={dataSource}
							renderRow={(rowData, sectionID, rowID) => {
								const info = {
									rowData,
									rowID,
									getBooKDetail,
									testRightCallBack
									// setCollect,
									// collectSucceed
								}
								return (
									<>
										<BookListContent key={rowData.id} {...info} />
									</>
								)
							}}
							useBodyScroll={true}
							pullToRefresh={refresh ? <PullToRefresh
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/> : ''}
							onEndReachedThreshold={1}
							onEndReached={onEndReached}
							pageSize={18}
							initialListSize={21}
							renderFooter={() => (<div style={document.querySelector('.player') ? { padding: '.3rem 0 2rem 0', textAlign: 'center' } : { padding: '.3rem 0 1.5rem 0', textAlign: 'center' }}>
								{this.state.isLoading ? 'Loading...' : '没有更多了'}
							</div>)}
						/>
					</div>
				)
			}
		}
	}
}

export default index;