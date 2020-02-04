import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile'
import { sendCode, auth_mobile, change_pwd, login, user_info_no, register } from '../../services/user'
import './index.scss'
import LoginHeader from '../../components/LoginHeader'
class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: ['账户登录', 'login'],
            loginContent: true,
            registered: false,
            Retrieve: false,
            changePassWord: false,
            userIptFocus: false,
            pswIptFocus: false,
            telNumber: '',
            passWord: '',
            rePassWord: '',
            codeNumber: '',
            getCode: '获取验证码',
            invitation_code: '',
            invitationIptFocus: false
        }
    }
    componentDidMount() {
        if (this.props.history.location.state) {
            const { type, code } = this.props.history.location.state
            if (type) {
                this.setState({
                    loginContent: false,
                    registered: true,
                    title: ['账户注册', 'registered'],
                    telNumber: '',
                    passWord: '',
                    codeNumber: '',
                    rePassWord: ''
                }, () => {
                    this.setState({
                        invitation_code: code
                    })
                })
            }else{
                this.setState({
                    telNumber: '',
                    passWord: '',
                    codeNumber: '',
                    rePassWord: ''
                }, () => {
                    this.setState({
                        invitation_code: code
                    })
                })
            }
        }
    }
    goTovideoDetail = () => {
        if (this.props.history.location.state) {
            const { id, bookId } = this.props.history.location.state
            if (id) {
                this.props.history.replace('/detailVideo/' + id)
                return false
            }
            if (bookId) {
                this.props.history.replace({
                    pathname: '/book',
                    state: {
                        id: bookId
                    }
                })
                return false
            }
        }
        this.props.history.goBack()
    }
    login = async (info) => {
        const { telNumber, passWord } = this.state
        const _this = this
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
            sessionStorage.setItem('user_id', res.user_id)
            sessionStorage.setItem('mobile', res.mobile)
            user_info_no({
                user_id: res.user_id
            }).then(ret => {
                sessionStorage.setItem('invitation_code', ret.invitation_code)
                Toast.info(info || '登录成功', 1, () => {
                    _this.goTovideoDetail()
                }, false)
            })

        })
    }
    register = () => {
        const { telNumber, codeNumber, passWord, invitation_code } = this.state
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
        register({
            mobile: telNumber,
            password: passWord,
            code: codeNumber,
            invite: invitation_code || ''
        }).then(res => {
            const { code } = res
            if (code) {
                if (code !== 0) {
                    Toast.info(res.err)
                    return false
                }
            }
            Toast.info('注册成功', 1, null, false)
            this.login('注册成功')
        })
    }
    goBack = () => {
        const title = this.state.title
        if (title[0] === '验证手机' || title[0] === '修改密码') {

            this.setState({
                title: ['账户登录', 'login'],
                loginContent: true,
                registered: false,
                Retrieve: false,
                changePassWord: false,
                telNumber: '',
                passWord: '',
                rePassWord: '',
                codeNumber: '',
                getCode: '获取验证码',

            })
            return false
        }
        this.props.history.goBack()
    }
    inputItem = (obj) => {
        return (
            <div className="Ipt">
                <input className={!obj.focus && 'inputNotActive'} type={obj.type} name="" id="" maxLength={obj.tel ? 11 : ''} placeholder={obj.placeholder} value={obj.value} onBlur={() => {
                    obj.onBlur()
                    // this.setState({
                    //     pswIptFocus: false
                    // })

                }} onFocus={(e) => {
                    obj.onFocus()
                    // e.stopPropagation()
                    // this.setState({
                    //     pswIptFocus: true
                    // })

                }} onChange={(e) => {
                    obj.onChange(e)
                    // this.setState({
                    //     passWord: e.target.value
                    // })
                }} />
                <div className="iconBox">
                    <img src={obj.focus ? require(`../../assets/images/${obj.focusPng}.png`) : require(`../../assets/images/${obj.blurPng}.png`)} alt="" className="icont" />
                </div>

            </div>
        )
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
        const { telNumber, getCode } = this.state
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
                const {code}=res
                if (code === 0) {
                    Toast.info(res.suc, 1, null, false)
                    this.timeChange()
                    return false
                } 
                    Toast.info(res.err)
                
            })

        }
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
                changePassWord: true,
                Retrieve: false,
                codeNumber: '',
                passWord: '',
                rePassWord: '',
                title: ['修改密码', 'changePassWord']
            })
            Toast.info(res.suc, 1, null, false)
            return false


        })
    }
    changePSWSubMit = async () => {
        const { telNumber, passWord, rePassWord } = this.state
        if (!telNumber && telNumber.length !== 11) {
            Toast.info('请重新验证手机')
            return false
        }
        if (passWord !== rePassWord) {
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
                title,
                loginContent,
                registered,
                changePassWord,
                telNumber,
                passWord,
                codeNumber,
                getCode,
                invitation_code,
                userIptFocus,
                pswIptFocus,
                invitationIptFocus,
                rePswIptFocus,
                Retrieve,
                rePassWord
            },
            goBack,
            geiCodeNumber,
            inputItem,
            registeredSubMit,
            changePSWSubMit,
            login,
            register
        } = this
        const loginHeader = {
            title: title[0],
            goBack
        }
        const modalStyle = {
            margin: 'auto',
            // width: '80%',
            // height: '40%',
            // background: "url(" + require("../../assets/images/BG.png") + ") no-repeat center ",
            // backgroundAttachment: 'fixed',
            borderRadius: '.2rem',
            // zIndex: '1111111'
        }
        const telInput = {
            type: 'text',
            tel: 1,
            placeholder: '请输入手机号',
            onBlur: () => {
                this.setState({
                    userIptFocus: false
                })
            },
            onFocus: () => {
                this.setState({
                    userIptFocus: true
                })
            },
            onChange: (e) => {
                this.setState({
                    telNumber: e.target.value
                })
            },
            value: telNumber,
            focus: userIptFocus,
            focusPng: 'phone_pressed_ico',
            blurPng: 'phone_nomal_ico'
        }
        const pswIpt = {
            type: 'password',
            // tel: 1,
            placeholder: '请输入密码',
            onBlur: () => {
                this.setState({
                    pswIptFocus: false
                })
            },
            onFocus: () => {
                this.setState({
                    pswIptFocus: true
                })
            },
            onChange: (e) => {
                this.setState({
                    passWord: e.target.value
                })
            },
            value: passWord,
            focus: pswIptFocus,
            focusPng: 'password_pressed_ico',
            blurPng: 'password_nomal_ico'
        }
        const invitationIpt = {
            // className:'inputActive',
            type: 'text',
            // tel: 1,
            placeholder: '请输入邀请码(选填)',
            onBlur: () => {
                this.setState({
                    invitationIptFocus: false
                })
            },
            onFocus: () => {
                this.setState({
                    invitationIptFocus: true
                })
            },
            onChange: (e) => {
                this.setState({
                    invitation_code: e.target.value
                })
            },
            value: invitation_code,
            focus: invitationIptFocus,
            focusPng: 'invite_pressed',
            blurPng: 'invite_nomal'
        }
        const rePassWordIpt = {
            type: 'password',
            // tel: 1,
            placeholder: '请再次输入密码',
            onBlur: () => {
                this.setState({
                    rePswIptFocus: false
                })
            },
            onFocus: () => {
                this.setState({
                    rePswIptFocus: true
                })
            },
            onChange: (e) => {
                this.setState({
                    rePassWord: e.target.value
                })
            },
            value: rePassWord,
            focus: rePswIptFocus,
            focusPng: 'ico3',
            blurPng: 'ico2'
        }
        return (
            <div className={title[1] + ' userHome'} style={{
                width: '100vw',
                height: '100vh',
                background: `url(${require('../../assets/images/BG.png')})`
            }}>
                <LoginHeader {...loginHeader} />
                <div className="logo">
                    <img src={require('../../assets/images/kedouLogo.png')} alt="" />
                </div>
                <div className="userHomeContent">
                    {
                        loginContent && <div style={modalStyle} className='login' onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <div className='inputBox'>
                                {inputItem(telInput)}
                                {inputItem(pswIpt)}
                            </div>
                            <div className='footer'>
                                <span onClick={() => {
                                    this.setState({
                                        loginContent: false,
                                        registered: false,
                                        Retrieve: true,
                                        title: ['验证手机', 'Verify'],
                                        telNumber: '',
                                        passWord: '',
                                        codeNumber: '',
                                        rePassWord: ''
                                    })
                                }}>
                                    忘记密码？
                            </span>
                                <span onClick={() => {
                                    this.setState({
                                        loginContent: false,
                                        registered: true,
                                        title: ['账户注册', 'registered'],
                                        telNumber: '',
                                        passWord: '',
                                        codeNumber: '',
                                        rePassWord: ''
                                    })
                                }}>
                                    快速注册
                            </span>
                            </div>
                            <Button onClick={() => {
                                login()
                            }}>立即登录</Button>
                        </div>
                    }
                    {
                        registered && <div style={modalStyle} onClick={(e) => {
                            e.stopPropagation()
                        }} className='registered'>
                            {/* <p>注册</p> */}
                            <div className='inputBox'>
                                {inputItem(telInput)}
                                <div className='codeIpt' style={{
                                    display: 'flex',
                                    // border: '1px solid #aaa',
                                    // borderRadius: '.1rem',
                                    // height: ' .7rem',
                                    margin: '0.2rem 0'
                                }}>
                                    <input className={!this.state.codeIptFocus ? 'inputNotActive codeNumber' : 'codeNumber'} type="text" name="" placeholder='请输入验证码' onBlur={() => {
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
                                    } > {
                                            getCode
                                        }</span>
                                    <div className="iconBox">
                                        <img src={this.state.codeIptFocus ? require('../../assets/images/safe_pressed_ico.png') : require('../../assets/images/safe_nomal_ico.png')} alt="" className="icont" />
                                    </div>
                                </div>
                                {inputItem(pswIpt)}
                                {inputItem(invitationIpt)}
                                <div className='footer'>
                                    <span onClick={() => {
                                        this.setState({
                                            loginContent: false,
                                            registered: false,
                                            Retrieve: true,
                                            title: ['验证手机', 'Verify'],
                                            telNumber: '',
                                            passWord: '',
                                            codeNumber: '',
                                            rePassWord: ''
                                        })
                                    }}>
                                        忘记密码？
                            </span>
                                    <span onClick={() => {
                                        this.setState({
                                            loginContent: true,
                                            registered: false,
                                            Retrieve: false,
                                            title: ['账户登录', 'login'],
                                            telNumber: '',
                                            passWord: '',
                                            codeNumber: '',
                                            rePassWord: ''
                                        })
                                    }}>
                                        快速登录
                            </span>
                                </div>
                            </div>
                            <Button onClick={() => {
                                register()
                            }}>注册并登录</Button>
                        </div>
                    }
                    {
                        Retrieve && <div style={modalStyle} onClick={(e) => {
                            e.stopPropagation()
                        }} className='registered'>
                            <div className='inputBox'>
                                {inputItem(telInput)}
                                <div className='codeIpt' style={{
                                    display: 'flex',
                                    // border: '1px solid #aaa',
                                    // borderRadius: '.1rem',
                                    // height: ' .7rem',
                                    margin: '0.2rem 0'
                                }}>
                                    <input type="text" name="" placeholder='请输入验证码' className={!this.state.codeIptFocus ? 'inputNotActive codeNumber' : 'codeNumber'} onBlur={() => {
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
                        </div>
                    }
                    {
                        changePassWord && <div style={modalStyle} onClick={(e) => {
                            e.stopPropagation()
                        }} className='registered'>
                            <div className='inputBox'>
                                {inputItem(pswIpt)}
                                {inputItem(rePassWordIpt)}
                            </div>
                            <Button onClick={() => {
                                changePSWSubMit()
                            }}>提交并登录</Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default index;