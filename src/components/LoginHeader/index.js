import React from 'react'
import './index.scss'
function index(props) {
    const {
        title,
        goBack
    } = props
    return (
        <div className='loginHeader' onClick={()=>goBack()}>
            <div className="goback">
                <img src={require('../../assets/images/back-black.png')} alt=""/>
            </div>
            <div className="title">
                {title}
            </div>
        </div>
    )
}

export default index
