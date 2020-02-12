/**
 * @description  视频|听书 评论项组件 基于ListView 需传入rowData 
 * @memberof Audio
 * @memberof VideoDetail/components/ViewList.js
 * @param type={str} video 区分详情页 
 * @time 2020/1/31
 * @author Aiden <y1-aiden@ik8s.com>
 */
import {crypt} from '../../utils/base'
import { Toast } from 'antd-mobile';
import React, { Component } from 'react';
import { comment_thumbs } from '../../services/book';
import { commentLikeApi } from '../../services/videoDetail';
class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            thumbed: '',
            thumbs: ''
        }
    }
    componentDidMount() {
        this.initialization()
    }
    //初始化获取参数
    initialization = () => {
        const { type, rowData } = this.props
        switch (type) {
            case 'video':
                this.setState({
                    thumbed: rowData.user_fabulous,
                    thumbs: rowData.liked_num,
                    id: rowData.id,
                    created_date: rowData.addtime
                })
                break;

            default:
                this.setState({
                    thumbed: rowData.thumbed,
                    thumbs: rowData.thumbs,
                    id: rowData.id,
                    created_date: rowData.created_date
                })
                break;
        }
    }
    //评论点赞
    setThumbed = () => {
        const { type } = this.props
        switch (type) {
            case 'video':
                commentLikeApi({
                    user_id: crypt(sessionStorage.getItem('user_id')),
                    type: '3',
                    comment_id: this.state.id
                }).then(res => {
                    if (res.code === 0) {
                        Toast.info(res.suc, 1, null, false)
                        this.setState({
                            thumbed: 1,
                            thumbs: this.state.thumbs + 1
                        })
                    } else {
                        Toast.info(res.err, 1, null, false)
                    }

                })
                break;
            default:
                comment_thumbs({
                    user_id: crypt(sessionStorage.getItem('user_id')),
                    comment_id: this.state.id
                }).then(res => {
                    if (res.code === 0) {
                        Toast.info(res.suc, 1, null, false)
                        this.setState({
                            thumbed: 1,
                            thumbs: this.state.thumbs + 1
                        })
                    } else {
                        Toast.info(res.err, 1, null, false)
                    }

                })
                break;
        }

    }
    render() {
        const {
            state: {
                thumbed,
                thumbs,
                created_date
            },
            props: {
                rowData
            },
            setThumbed
        } = this
        return (
            <div>
                <div className='commentBox'>
                    <div className="commentTop">
                        <div className="left">
                            <div className="img">
                                <img src={rowData.avatar_url} alt="" />
                            </div>
                            <div className="name">
                                <p>{rowData.nickname}</p>
                                <span>{created_date}</span>
                            </div>
                        </div>
                        <div className="right">
                            <div className="img" onClick={() => {
                                setThumbed()
                            }}>
                                <img src={thumbed ? require('../../assets/images/comment_like_pressed.png') : require('../../assets/images/comment_like_nomal.png')} alt="" />
                            </div>
                            <span className={thumbed && 'thumbed'}>
                                {
                                    thumbs
                                }
                            </span>
                        </div>
                    </div>
                    <div className="commentContent">
                        <div className="Triangle">
                        </div>
                        <div className="content">
                            {
                                rowData.message
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;
