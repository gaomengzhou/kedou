import React from 'react';
import ReactAplayer from 'react-aplayer';
import './index.scss'
import ListTitle from '../ListTitle'
import BookDetailGuess from '../BookDetailGuess'
import { Modal } from 'antd-mobile'
import { withRouter } from 'react-router-dom';
@withRouter
class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			serialNum:1,
			serialShow: false,
			playerList: [],
			player: '',
			show: false,
			detailShow: true,
			play: false,
			serial: '第1集',
			modal2: false
		}
	}
	componentDidMount() {
		this.setState({
			name: this.props.novelTitle,
			url: this.props.player.src,
			cover: this.props.novelPoster,
			show: true
		}, () => {
			document.querySelector('.aplayer-author').innerHTML = '第1集'
			document.querySelector('.aplayer-icon-loop').remove()
		})
	}
	componentWillUnmount() {
		this.onPause()
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
		await this.setState({
			show: false
		})
		await this.setState({
			url,
			show: true,
			serialShow: false
		}, () => {
			this.ap.toggle()
			document.querySelector('.aplayer-author').innerHTML = `第${num}集`
			document.querySelector('.aplayer-icon-loop').remove()
		})
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
				modal2
			},
			props:{
				getBooKDetail
			},
			changeSrc
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
		console.log(this.props);

		return (
			<div className={detailShow ? 'playerDetail' : 'player'}>
				{
					detailShow && <>
						<div className="top">
							<div className="header">
								<img className='minimize' src={require('../../assets/images/back_btn.png')} alt="" onClick={() => {
								this.props.setDetailShow()
								this.setState({
									detailShow: !this.state.detailShow
								})
								
							}} />
								<div className="title">
									{this.props.novelTitle}-{this.state.serial}
								</div>
								<div className="Nothing"></div>
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
										<img src={modal2?require('../../assets/images/book_list_pressed.png'):require('../../assets/images/book_list_nomal.png')} alt="" />
									</div>
									<div className="img">
										<img src={require('../../assets/images/before_btn.png')} alt="" />
									</div>
									<div className="img">
										<img src={play ? require('../../assets/images/pause_btn.png') : require('../../assets/images/play_btn.png')} alt="" onClick={() => {
											this.ap.toggle()
										}} />
									</div>
									<div className="img">
										<img src={require('../../assets/images/nexy_btn.png')} alt="" />
									</div>
									<div className="img">
										<img src={require('../../assets/images/time_nomal.png')} alt="" />
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
								<div className="comment">
									<img src={require('../../assets/images/view_comment_btn.png')} alt="" />
									<p>{this.props.detailInfo.love}</p>
								</div>
							</div>
							<div className="right">
								<div className="collected">
									<img src={this.props.detailInfo.collected ? require('../../assets/images/thumbnail_like_pressed_btn.png') : require('../../assets/images/user_favorite_btn.png')} alt="" />
								</div>
								<div className="share">
									<img src={require('../../assets/images/share_btn.png')} alt="" />
								</div>
							</div>
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
							{playerList.map(e =>{
								if(e.serial===this.state.serialNum){
									return(
										<p className='serialActive' onClick={() => {
											this.setState({
												serialNum:e.serial,
												serial: `第${e.serial}集`
											})
											changeSrc(e.src, e.serial)
										}}>第{e.serial}集</p>
									)
								}
								return  (
									<p className='serial' onClick={() => {
										this.setState({
											serialNum:e.serial,
											serial: `第${e.serial}集`
										})
										changeSrc(e.src, e.serial)
									}}>第{e.serial}集</p>
								)
							})}
						</Modal>
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
				/>}

			</div>
		);
	}
}
export default App