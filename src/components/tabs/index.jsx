 /**
 * @description 需传入标签列表 并赋值给tabs变量
 * @memberof Video
 * @memberof Book
 * @time 2020/1/7
 * @author Aiden
 */

import React, { Component } from 'react';
import { Tabs } from 'antd-mobile'
import TabContent from '../TabContent'
import BookTabContent from '../BookTabContent'
import { connect } from 'react-redux';
import { goBackchangeTab,goBackList } from '../../store/action/video'
const stateToProps = (state) => {
	return {
		tabAction: state.video.tabAction,
	}
}
const mapDispatchToProps = {
	goBackchangeTab,
	goBackList
};
@connect(stateToProps, mapDispatchToProps)
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeKey: null
		}
	}
	componentDidMount() {
		this.setState({
			activeKey: this.props.tabAction
		})
		this.goBackchangeTab(this.props.route)
	}
	goBackchangeTab=(route)=>{
		const oldRoute=sessionStorage.getItem('route')
		if(route!==oldRoute){
			this.props.goBackchangeTab('')
			this.props.goBackList('')
		}
		sessionStorage.setItem('route',this.props.route)
	}

	changeActionKey = (sty) => {
		// console.log(sty, this.state.activeKey);

		const oldNum = this.state.activeKey
		//console.log('123123123123',sty);

		if (sty !== oldNum) {
			this.props.goBackchangeTab(sty)
			this.setState({
				activeKey: sty
			})
		}
		return false
	}
	renderContent = tab => {
		//console.log('renderContent',tab);
		if (this.props.labelList && this.props.hotVideoList) {
			const tabContent = {
				tab: tab,
				changeActionKey: this.changeActionKey,
				recommend: this.props.recommend,
				newVideoList: this.props.newVideoList,
				hotVideoList: this.props.hotVideoList,
				hotLabel: this.props.hotLabel,
				getHomeLabelList: this.props.getHomeLabelList,
				goToVideoDetail: this.props.goToVideoDetail,
				headerShow: this.props.headerShow,
				labelList: this.props.labelList,
				closeMyLoginShow: this.props.closeMyLoginShow,

			}
			return <TabContent key={tab.key} {...tabContent} />
		}
		const tabContent = {
			tab: tab,
			tabList: this.props.tabList,
			changeActionKey: this.changeActionKey,
			getBooKDetail: this.props.getBooKDetail,
			testRightCallBack: this.props.testRightCallBack,
			closeMyLoginShow: this.props.closeMyLoginShow
			// setCollect:this.props.setCollect,
			// collectSucceed:this.props.collectSucceed
		}
		return <BookTabContent key={tab.key} {...tabContent} />

	}


	render() {
		const { detailShow } = this.props
		const tabs = this.props.tabList || this.props.labelList
		return (
			<div >
				<Tabs
					page={this.state.activeKey}
					tabs={!detailShow ? tabs : []}
					renderTabBar={props => <Tabs.DefaultTabBar {...props}
						page={5} />}
					onTabClick={(tab, index) => {
						this.setState({
							activeKey: tab.key
						},()=>{
							this.props.goBackchangeTab(tab.key)
							// this.props.goBackList('')
						})
					}
					}
					swipeable={false}
				>
					{this.renderContent}
				</Tabs>
			</div>
		);
	}
}

export default index;