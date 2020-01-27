import React from 'react'
import './index.less'
function index(props) {
    const {title,more,changeActionKey,right}=props
    return (
        <div id='listTitle'>
           <div className="titleInfo">
              <img src={require('../../assets/images/text_ico.png')} alt="" className="icont"/>
               {
                   title
               }
           </div>
           {more&&<span className="more" onClick={()=>{
               changeActionKey(title)
           }}>
               更多
           </span>}
           {right&& <span className='right'>
               {right} <span className="textRight">
                   听过
               </span>
               </span>}
        </div>
    )
}

export default index
