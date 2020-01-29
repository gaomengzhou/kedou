import React, { Component } from 'react';
import { Tabs } from 'antd-mobile'
import TabContent from '../TabContent'
import BookTabContent from '../BookTabContent'
class index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeKey: null
		}
	}
	changeActionKey = (sty) => {
		// console.log(sty, this.state.activeKey);

		const oldNum = this.state.activeKey
		//console.log('123123123123',sty);

		if (sty !== oldNum) {
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
		;
	componentDidMount() {
	}

	render() {
		const {detailShow}=this.props
		const tabs = this.props.tabList || this.props.labelList
		return (
			<div >
				<Tabs
					page={this.state.activeKey}
					tabs={!detailShow?tabs:[]}
					renderTabBar={props => <Tabs.DefaultTabBar {...props}
						page={5} />}
					onTabClick={(tab, index) => this.setState({
						activeKey: tab.key
					})
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