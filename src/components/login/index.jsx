 /**
 * @deprecated (废弃)
 * @description 登录|注册|忘记密码 弹窗
 * @time 2020/1/8
 * @author Aiden
 */
import {encrypt} from '../../utils/base'
import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile'
import { register, sendCode, login, auth_mobile, change_pwd, user_info_no } from '../../services/user'
import './index.less'
import { withRouter } from 'react-router-dom';
@withRouter
class index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loginContent: true,
			registered: false,
			Retrieve: false,
			changePassWord: false,
			telNumber: '',
			codeNumber: '',
			passWord: '',
			rePassWord: '',
			getCode: '获取验证码',
			userIptFocus: false,
			pswIptFocus: false,
			codeIptFocus: false,
			rePswIptFocus: false,
			invitation_code: ''
		}
	}

	componentDidMount() {
		if (this.props.match.params.code) {
			this.setState({
				invitation_code: this.props.match.params.code
			})
		}
	}

	initialization = async () => {
		await this.setState({
			loginContent: true,
			registered: false,
			Retrieve: false,
			changePassWord: false,
			telNumber: '',
			codeNumber: '',
			passWord: '',
			getCode: '获取验证码'
		})

		this.props.rightCallBack()
	}
	timeChange = () => {
		let num = 60
		const time = setInterval(() => {
			num--
			this.setState({
				getCode: `${num}秒重试`
			})
			if (num === 0) {
				clearInterval(time)
				this.setState({
					getCode: '重新获取'
				})
			}
		}, 1000)
	}
	geiCodeNumber = (event = 'register') => {
		const getCode = this.state.getCode
		const { telNumber } = this.state
		if (telNumber.length !== 11) {
			Toast.info('请填写正确的手机号')
			return false
		}
		if (getCode === '获取验证码' || getCode === '重新获取') {
			sendCode({
				mobile: telNumber,
				event,
				type: 'user'
			}).then(res => {
				if (res.code === 0) {
					Toast.info(res.suc, 1, null, false)
					this.timeChange()
				} else {
					Toast.info(res.err)
				}
			})

		}
	}
	register = () => {
		const { telNumber, codeNumber, passWord, invitation_code } = this.state
		register({
			mobile: telNumber,
			password: passWord,
			code: codeNumber,
			invite: invitation_code || ''
		}).then(res => {
			const { code } = res
			if (code) {
				if (code !== 0) {
					if (!telNumber) {
						Toast.info('请填写手机号')
						return false
					}
					if (!passWord) {
						Toast.info('请填写密码')
						return false
					}
					if (!codeNumber) {
						Toast.info('请填写验证码')
						return false
					}
					Toast.info(res.err)
					return false
				}
			}
			Toast.info('注册成功', 1, null, false)
			this.login('注册成功')
		})
	}
	login = async (info) => {
		const { telNumber, passWord } = this.state
		if (!telNumber) {
			Toast.info('请填写手机号')
			return false
		}
		if (!passWord) {
			Toast.info('请填写密码')
			return false
		}
		await login({
			mobile: telNumber,
			password: passWord,
			mold: 'pwd'
		}).then(res => {
			const { code } = res
			if (code) {
				if (res.code !== 0) {
					Toast.info('请正确填写用户名和密码')
					return false
				}
			}
			sessionStorage.setItem('user_id', encrypt(res.user_id))
			sessionStorage.setItem('mobile', res.mobile)
			user_info_no({
				user_id: res.user_id
			}).then(ret => {
				sessionStorage.setItem('invitation_code', ret.invitation_code)
				Toast.info(info || '登录成功', 1, null, false)
			})
			this.initialization()
		})
	}
	registeredSubMit = async () => {
		const { telNumber, codeNumber } = this.state
		if (!telNumber) {
			Toast.info('请填写手机号')
			return false
		}
		if (!codeNumber) {
			Toast.info('请填写验证码')
			return false
		}
		await auth_mobile({
			mobile: telNumber,
			event: 'auth_mobile',
			code: codeNumber
		}).then(res => {
			const { code } = res
			if (code !== 0) {
				Toast.info(res.err)
				return false
			}
			this.setState({
				changePassWord: !this.state.changePassWord,
				Retrieve: !this.state.Retrieve,
				codeNumber: '',
				passWord: ''
			})
			Toast.info(res.suc, 1, null, false)
			return false


		})
	}
	changePSWSubMit = async () => {
		const { telNumber, passWord, rePassWord } = this.state
		if (telNumber.length !== 11 || passWord !== rePassWord) {
			Toast.info('两次密码不一样')
			return false
		}
		if (passWord.length < 6) {
			Toast.info('密码不能小于6位')
			return false
		}
		await change_pwd({
			mobile: telNumber,
			password: passWord
		}).then(res => {
			const { code } = res
			if (code !== 0) {
				Toast.info(res.err)
				return false
			}
			Toast.info(res.suc, 1, null, false)
			this.login(res.suc)

		})
	}
	render() {
		const {
			state: {
				loginContent,
				registered,
				Retrieve,
				changePassWord,
				telNumber,
				codeNumber,
				passWord,
				getCode,
				rePassWord
			},
			login,
			geiCodeNumber,
			register,
			initialization,
			registeredSubMit,
			changePSWSubMit
		} = this
		const modalStyle = {
			margin: 'auto',
			width: '80%',
			// height: '40%',
			background: "url(" + require("../../assets/images/BG.png") + ") no-repeat center ",
			// backgroundAttachment: 'fixed',
			borderRadius: '.2rem',
			zIndex: '1111111'
		}
		return (
			<div style={{
				position: 'fixed',
				backgroundColor: 'rgba(0,0,0,0.4)',
				left: '0',
				right: '0',
				top: '0',
				bottom: '0',
				margin: 'auto',
				zIndex: '999',
				display: 'flex',
				alignItems: 'center'
			}} className="modal-home">
				{
					loginContent && <div style={modalStyle} className='login' onClick={(e) => {
						e.stopPropagation()
					}}>
						<p>登录</p>
						<div className='inputBox'>
							<div className="Ipt">
								<input type="text" maxLength='11' placeholder='请输入手机号' onBlur={() => {
									this.setState({
										userIptFocus: false
									})

								}} onFocus={(e) => {
									this.setState({
										userIptFocus: true
									})

								}} value={telNumber} onChange={(e) => {
									this.setState({
										telNumber: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.userIptFocus ? require('../../assets/images/phone_pressed_ico.png') : require('../../assets/images/phone_nomal_ico.png')} alt="" className="icont" />
								</div>
							</div>
							<div className="Ipt">
								<input type="password" name="" id="" placeholder='请输入密码' value={passWord} onBlur={() => {
									this.setState({
										pswIptFocus: false
									})

								}} onFocus={(e) => {
									e.stopPropagation()
									this.setState({
										pswIptFocus: true
									})

								}} onChange={(e) => {
									this.setState({
										passWord: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.pswIptFocus ? require('../../assets/images/password_pressed_ico.png') : require('../../assets/images/password_nomal_ico.png')} alt="" className="icont" />
								</div>

							</div>
						</div>
						<div className='footer'>
							<span onClick={() => {
								this.setState({
									loginContent: !this.state.loginContent,
									Retrieve: !this.state.Retrieve
								})
							}}>
								忘记密码？
						</span>
							<span onClick={() => {
								this.setState({
									loginContent: !this.state.loginContent,
									registered: !this.state.registered
								})
							}}>
								去注册 >
						</span>
						</div>
						<Button onClick={() => {
							login()
						}}>确定</Button>
						<div className='close_btn' onClick={() => {
							initialization()
						}}>
							<img src={require('../../assets/images/close_btn.png')} alt="" />
						</div>
					</div>
				}
				{
					registered && <div style={modalStyle} onClick={(e) => {
						e.stopPropagation()
					}} className='registered'>
						<p>注册</p>
						<div className='inputBox'>
							<div className="Ipt">
								<input type="text" maxLength='11' placeholder='请输入手机号' onBlur={() => {
									this.setState({
										userIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										userIptFocus: true
									})

								}} value={telNumber} onChange={(e) => {
									this.setState({
										telNumber: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.userIptFocus ? require('../../assets/images/phone_pressed_ico.png') : require('../../assets/images/phone_nomal_ico.png')} alt="" className="icont" />
								</div>
							</div>
							<div className='codeIpt' style={{
								display: 'flex',
								// border: '1px solid #aaa',
								// borderRadius: '.1rem',
								// height: ' .7rem',
								margin: '0.2rem 0'
							}}>
								<input type="text" name="" placeholder='请输入验证码' className='codeNumber' onBlur={() => {
									this.setState({
										codeIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										codeIptFocus: true
									})

								}} style={{
									flex: 1
								}} value={codeNumber} onChange={(e) => {
									this.setState({
										codeNumber: e.target.value
									})
								}} />
								<span onClick={
									() => {
										geiCodeNumber()
									}
								} > {getCode}</span>
								<div className="iconBox">
									<img src={this.state.codeIptFocus ? require('../../assets/images/safe_pressed_ico.png') : require('../../assets/images/safe_nomal_ico.png')} alt="" className="icont" />
								</div>
							</div>
							<div className="Ipt">
								<input type="password" name="" id="" placeholder='请输入密码' value={passWord} onBlur={() => {
									this.setState({
										pswIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										pswIptFocus: true
									})

								}} onChange={(e) => {
									this.setState({
										passWord: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.pswIptFocus ? require('../../assets/images/password_pressed_ico.png') : require('../../assets/images/password_nomal_ico.png')} alt="" className="icont" />
								</div>

							</div>
						</div>
						<Button onClick={() => {
							register()
						}}>注册并登录</Button>
						<div className='close_btn' onClick={() => {
							initialization()
						}}>
							<img src={require('../../assets/images/close_btn.png')} alt="" />
						</div>
					</div>
				}
				{
					Retrieve && <div style={modalStyle} onClick={(e) => {
						e.stopPropagation()
					}} className='registered'>
						<p>忘记密码</p>
						<div className='inputBox'>
							<div className="Ipt">
								<input type="text" maxLength='11' placeholder='请输入手机号' onBlur={() => {
									this.setState({
										userIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										userIptFocus: true
									})

								}} value={telNumber} onChange={(e) => {
									this.setState({
										telNumber: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.userIptFocus ? require('../../assets/images/phone_pressed_ico.png') : require('../../assets/images/phone_nomal_ico.png')} alt="" className="icont" />
								</div>
							</div>
							<div className='codeIpt' style={{
								display: 'flex',
								// border: '1px solid #aaa',
								// borderRadius: '.1rem',
								// height: ' .7rem',
								margin: '0.2rem 0'
							}}>
								<input type="text" name="" placeholder='请输入验证码' className='codeNumber' onBlur={() => {
									this.setState({
										codeIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										codeIptFocus: true
									})

								}} style={{
									flex: 1
								}} value={codeNumber} onChange={(e) => {
									this.setState({
										codeNumber: e.target.value
									})
								}} />
								<span onClick={
									() => {
										geiCodeNumber('auth_mobile')
									}
								} > {getCode}</span>
								<div className="iconBox">
									<img src={this.state.codeIptFocus ? require('../../assets/images/safe_pressed_ico.png') : require('../../assets/images/safe_nomal_ico.png')} alt="" className="icont" />
								</div>
							</div>

						</div>
						<Button onClick={() => {
							registeredSubMit()
						}}>提交</Button>
						<div className='close_btn' onClick={() => {
							initialization()
						}}>
							<img src={require('../../assets/images/close_btn.png')} alt="" />
						</div>
					</div>
				}
				{
					changePassWord && <div style={modalStyle} onClick={(e) => {
						e.stopPropagation()
					}} className='registered'>
						<p>修改密码</p>
						<div className='inputBox'>
							<div className="Ipt">
								<input type="password" name="" id="" placeholder='请输入密码' value={passWord} onBlur={() => {
									this.setState({
										pswIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										pswIptFocus: true
									})

								}} onChange={(e) => {
									this.setState({
										passWord: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.pswIptFocus ? require('../../assets/images/password_pressed_ico.png') : require('../../assets/images/password_nomal_ico.png')} alt="" className="icont" />
								</div>

							</div>
							<div className="Ipt">
								<input type="password" name="" id="" placeholder='请输入密码' value={rePassWord} onBlur={() => {
									this.setState({
										rePswIptFocus: false
									})

								}} onFocus={() => {
									this.setState({
										rePswIptFocus: true
									})

								}} onChange={(e) => {
									this.setState({
										rePassWord: e.target.value
									})
								}} />
								<div className="iconBox">
									<img src={this.state.rePswIptFocus ? require('../../assets/images/ico3.png') : require('../../assets/images/ico2.png')} alt="" className="icont" />
								</div>

							</div>
						</div>
						<Button onClick={() => {
							changePSWSubMit()
						}}>提交并登录</Button>
						<div className='close_btn' onClick={() => {
							initialization()
						}}>
							<img src={require('../../assets/images/close_btn.png')} alt="" />
						</div>
					</div>
				}
			</div>
		);
	}
}

export default index;