/**
 * @description  video 页面 列表项组件
 * @memberof TabContent
 * @memberof BookTabContent
 * @param {str} type video||book区分视频和听书 默认video 
 * @param {number} hour 设置时间重新显示 默认2 (单位小时 可传小数)
 * @time 2020/2/7
 * @author Aiden
 */


import React, { Component } from 'react';

class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            headerImg: true
        }
    }
    componentDidMount() {
        this.initialization()
    }
    initialization = () => {
        const type = this.props.type || 'video'
        const oldDate = localStorage.getItem(type + 'HomeSettimeoutClose')
        const date = Date.now()
        const hour = this.props.hour
        if (date) {
            if (date - oldDate > this.countTimer(hour || 2)) {
                this.setState({
                    headerImg: true
                })
                localStorage.removeItem(type + 'HomeSettimeoutClose')
                return false
            }
            this.setState({
                headerImg: false
            })
            return false
        }
        this.setState({
            headerImg: true
        })
    }
    countTimer = (hour) => {
        return hour * 60 * 60 * 1000
    }
    settimeoutClose = (e) => {
        const type = this.props.type || 'video'
        e.stopPropagation()
        this.setState({
            headerImg: false
        })
        localStorage.setItem(type + 'HomeSettimeoutClose', Date.now())
    }
    render() {
        return (
            <>
                {this.state.headerImg && <div style={{
                    width: '100%',
                    // padding: '.5rem 0 0 0',
                    position: 'relative',
                    fontSize: '0'
                }} className="headerImg" onClick={() => {
                    const w = window.open('about:blank');
                    w.location.href = `https://kdsp1.xyz/${
                        sessionStorage.getItem('invitation_code') ? `?invite_code=${sessionStorage.getItem('invitation_code')}` : ''
                        }`;
                }}>
                    <img style={{
                        width: '100%',
                        height: '100%'
                    }} src={require('../../assets/images/banner-detail.png')} alt="" />
                    <div className="closeBtn" style={{
                        width: '.35rem',
                        position: 'absolute',
                        right: '.1rem',
                        top: '0'
                    }} onClick={this.settimeoutClose}>
                        <img style={{
                            width: '100%'
                        }} src={require('../../assets/images/close_btn.png')} alt="" />
                    </div>
                </div>}
            </>
        );
    }
}

export default index;