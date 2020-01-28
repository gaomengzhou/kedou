import React, { Component } from 'react';
import './index.less'
import { collect } from '../../services/book'
import { Toast } from 'antd-mobile'

class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collectSucceed: false
        }
    }
    componentDidMount() {
        let props = this.props
        if (!props.ev) {
            const ev = { ...props.rowData }
            props = {
                ev,
                ...props
            }
        }
        if (props.ev.collected) {
            this.setState({
                collectSucceed: true
            })
        }
    }

    setCollect = (novel_id) => {
        if (!sessionStorage.getItem('user_id')) {
            this.props.testRightCallBack()
            return false
        }
        collect({
            user_id: sessionStorage.getItem('user_id'),
            novel_id: novel_id
        }).then(res => {
            if (res.code === 0) {
                Toast.info(res.suc, 1, null, false)
                if (res.suc === '取消成功') {
                    this.setState({
                        collectSucceed: false
                    })
                    return false
                }
                this.setState({
                    collectSucceed: true
                })
            } else {
                Toast.info(res.err, 1, null, false)
            }

        })

    }
    render() {
        let props = this.props
        if (!props.ev) {
            const ev = { ...props.rowData }
            props = {
                ev,
                ...props
            }
        }
        const { collectSucceed } = this.state
        return (
            <>
                {
                    props && <div className="bookListContentBox">
                        <div className='bookListContent' onClick={() => {
                            props.getBooKDetail(props.ev.id)
                        }}>
                            <div className="img">
                                <img src={props.ev.poster} alt="" className='bigIMG' />
                                <div className='play'>
                                    <img src={require('../../assets/images/book_thumbnail_ico.png')} alt="" className='icont' />{props.ev.play}
                                </div>
                                <div className="collected" onClick={(e) => {
                                    e.stopPropagation()
                                    this.setCollect(props.ev.id)

                                }}>
                                    {<img src={collectSucceed ? require('../../assets/images/like_pressed_btn.png') : require('../../assets/images/like_nomal_btn.png')} alt="" />}
                                </div>
                            </div>
                            <p className='title'>
                                {
                                    props.ev.title
                                }
                            </p>
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default index;





// function index(props) {
//     if (!props.ev) {
//         const ev = { ...props.rowData }
//         props = {
//             ev,
//             ...props
//         }
//     }
//     const collectSucceed=[]
//     if(props.ev.collected){
//         collectSucceed.push[props.ev.id]
//     }

//     return (

//     )
// }

// export default index
