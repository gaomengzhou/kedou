/**
 * @component header
 * @description  首页头部组件 包含 我的 搜索
 * @parameter rightCallBack={fn} 头像点击回调  detailShow={boolean} 显示隐藏
 * @time 2020/1/7
 * @author Aiden
 */

import React from 'react'
import './index.less'
import { theme } from '../../utils/theme'
import { withRouter } from 'react-router-dom';

function index(props) {
	const {
		rightCallBack,
		detailShow
	} = props
	return (
		<header id="headerHome" style={!detailShow ? { display: 'block' } : { display: 'none' }} >

			<div className='header-search' style={{
				position: 'fixed',
				left: '0',
				top: '0',
				zIndex: '999',
				backgroundColor: 'rgba(0, 0, 0, 0)'
			}} >
				<div style={{
					position: 'fixed',
					left: '0',
					top: '0',
					width: '100vw',
					height: '1.5rem',
					zIndex: '-1',
					backgroundImage: theme.headerColor
				}} className='background' >

				</div>
				{/* <div className="envelope">
						<div style={{
							height: '100%',
							width: '100%',
							textAlign: 'center',
							lineHeight: 0,
							backgroundColor: 'rgba(0, 0, 0, 0)',
						}}
							onClick={() => {
								leftCallBack()

							}}>
							<img src={require('@/assets/images/download.png')} alt="" style={{
								height: '.5rem',
								width: '.5rem'
							}} />
						</div>
					</div> */}
				<div className="my">
					<div style={{
						height: '100%',
						width: '100%',
						textAlign: 'center',
						lineHeight: 0,
						backgroundColor: 'rgba(0, 0, 0, 0)',
					}}
						onClick={() => {
							rightCallBack()
						}}>
						{<img src={sessionStorage.getItem('user_id') ? require('../../assets/images/user_pressed.png') : require('../../assets/images/user_nomal.png')} alt="" style={{
							height: '.5rem',
							width: '.5rem'
						}} />}
					</div>

				</div>
				<div className="search" onClick={
					() => {
						props.history.push('/search/type=' + props.type)

					}
				}>
					<span>
						输入搜索关键字
						</span>
					<div className="searchBTN">
						<img src={require('../../assets/images/search.png')} alt="" />
					</div>
					{/* <SearchBar placeholder="搜索" style={{
							padding: '.1rem',
							backgroundColor: '#fff',
							border: '1px solid #EEE',
							height: '.5rem',
							borderRadius: '.1rem'
						}}
							defaultValue='asdasd'
							showCancelButton={true}
							cancelText={<p style={{
								padding: '0 0 0 .1rem',
								borderLeft: '1px solid #eee'
							}}>{<Icon type="search" />}</p>}
							onCancel={() => searchSubmit()}
							onSubmit={() => searchSubmit()}
							onChange={(value) => changeSearchText(value)}
							value={searchText}
						/> */}

				</div>
			</div>
		</header>
	)
}

export default withRouter(index)






// class index extends Component {
// 	constructor(props) {
// 		super(props)

// 		this.state = {
// 			// searchText: ''
// 		}
// 	}
// 	// searchSubmit = () => {
// 	// 	this.setState({ searchText: '' })
// 	// }
// 	// changeSearchText = (value) => {
// 	// 	this.setState({ searchText: value })
// 	// }
// 	render() {
// 		const {
// 			props: {
// 				// leftCallBack,
// 				rightCallBack,
// 				detailShow
// 			},
// 			// searchSubmit,
// 			// changeSearchText
// 		} = this
// 		return (

// 		)
// 	}
// }

// export default index;