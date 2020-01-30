import React, { Component } from 'react';
import {comment_thumbs} from '../../services/book'
import { Toast } from 'antd-mobile'
class index extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            thumbed:'',
            thumbs:''
        }
    }
    componentDidMount() {
        const rowData=this.props.rowData
        this.setState({
            thumbed:rowData.thumbed,
            thumbs:rowData.thumbs,
            id:rowData.id
        })
    }
    
    setThumbed=()=>{
        comment_thumbs({
            user_id:sessionStorage.getItem('user_id'),
            comment_id:this.state.id
        }).then(res=>{
            if(res.code===0){
                Toast.info(res.suc, 1, null, false)
                this.setState({
                    thumbed:1,
                    thumbs:this.state.thumbs+1
                })
            }else{
                Toast.info(res.err, 1, null, false)
            }
            
        })
        
    }
    render() {
        const {
            state:{
                thumbed,
                thumbs
            },
            props:{
                rowData
            },
            setThumbed
        }=this
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
                                <span>{rowData.created_date}</span>
                            </div>
                        </div>
                        <div className="right">
                            <div className="img" onClick={()=>{
                               setThumbed()
                            }}>
                                <img src={thumbed ? require('../../assets/images/comment_like_pressed.png') : require('../../assets/images/comment_like_nomal.png')} alt="" />
                            </div>
                            <span>
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