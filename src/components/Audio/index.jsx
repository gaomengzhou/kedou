import React from 'react';
import ReactAplayer from 'react-aplayer';

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			serialShow: false,
			playerList: [],
			player: '',
			show: false
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
		console.log('on play');
	};

	onPause = () => {
		this.ap.pause()
		console.log('on pause');
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
			serialShow: !this.state.serialShow
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
				show
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

		return (
			<div className='player'>
				{
					this.state.serialShow && <div className='playerSerial'>
						{
							playerList.map(e => (
								<p onClick={() => {
									changeSrc(e.src, e.serial)
								}}>第{e.serial}集</p>
							))
						}
					</div>
				}
				<p className='select' onClick={() => {
					this.setState({
						serialShow: !this.state.serialShow
					})
				}} >选集</p>
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