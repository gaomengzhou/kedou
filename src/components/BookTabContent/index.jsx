import React, { Component } from 'react';
import { PullToRefresh, ListView, Carousel } from 'antd-mobile';
import { bookList as getBookList } from '../../services/book'
import BookListContent from '../BookListContent'
import ListTitle from '../ListTitle'
import { bannel_list } from '../../services/bannel'
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
			bannel: [],
			bookList: []
		}
	}

	async componentDidMount() {
		await bannel_list({
			type: 1
		}).then(res => {
			console.log(res);
			
			this.setState({
				bannel: res
			})

		})
		await bannel_list({
			type: 3
		}).then(res => {
			console.log(res);
			
			// this.setState({
			// 	bannel: res
			// })

		})
		await this.onRefresh()
	}

	onRefresh = async () => {
		await this.setState({
			isRefreshing: true
		})
		switch (this.props.tab.title) {
			case this.props.tabList[0].title: {
				let newList;
				let hotList;
				let obj;
				await getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: 1,
					rows: 10,
					order: "created_date",
					sort: "created_date"
				}).then(res => {
					newList = res
				})
				await getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: 1,
					rows: 10,
					order: "play",
				}).then(ret => {
					hotList = ret
					obj = {
						newList,
						hotList
					}
				})
				await this.setState({
					bookList: obj
				})
				break;
			}
			case this.props.tabList[1].title: {
				await getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: 1,
					rows: 20,
					order: "created_date",
					sort: "created_date"
				}).then(res => {
					this.setState({
						bookList: res
					})
				})
				break
			}
			case this.props.tabList[2].title: {
				await getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: 1,
					rows: 20,
					order: "play",
				}).then(res => {
					this.setState({
						bookList: res
					})
				})
				break
			}
			default: {
				await getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: 1,
					rows: 20,
					category_id: this.props.tab.category_id
				}).then(res => {
					this.setState({
						bookList: res
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
	concatList = () => {
		const list = this.state.bookList
		switch (this.props.tab.title) {
			case this.props.tabList[1].title: {
				getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: this.state.page + 1,
					rows: 10,
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
						rows: 20,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
			}
			case this.props.tabList[2].title: {
				getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: this.state.page+1,
					rows: 10,
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
						rows: 20,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
			}
			default: {
				getBookList({
					user_id:sessionStorage.getItem('user_id')||'',
					page: this.state.page+1,
					rows: 10,
					category_id:this.props.tab.category_id
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
						rows: 20,
						dataSource: this.state.dataSource.cloneWithRows(bookList),
					})
				})
				break
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
			isLoading: false
		})
		loading = false
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
			props:{
				getBooKDetail,
				testRightCallBack
			},
			onRefresh,
			onEndReached,
			listHeader
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
					<div id="bookHomeList">
						<ListView
						dataSource={dataSource}
						renderHeader={() => listHeader()}
						renderRow={(rowData, sectionID, rowID) => {
							console.log(rowData);
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
						pullToRefresh={<PullToRefresh
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>}
						// onEndReachedThreshold={10}
						onScroll={() => {
							if (document.querySelector('.background') && document.querySelector('.header-search') && document.querySelector('.am-tabs-tab-bar-wrap') && document.querySelector('.am-tab-bar-bar')) {
								this.scrollDirect()
							} else {
								return false
							}
						}
						}
						scrollEventThrottle={11111111110}
						// onEndReached={onEndReached}
						renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
							{this.state.isLoading ? 'Loading...' : (noMore ? '没有更多了' : '')}
						</div>)}
					/>
					</div>
				)
			}
			case this.props.tabList[1].title: case this.props.tabList[2].title: {
				return (
					<div className="tabsList">
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
			default: {
				return (
					<div className="tabsList">
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