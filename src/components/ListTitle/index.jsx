import React from 'react'
import './index.less'
function index(props) {
    const {title,more,changeActionKey}=props
    return (
        <div id='listTitle'>
           <div className="titleInfo">
              <img src={require('@/assets/images/text_ico.png')} alt="" className="icont"/>
               {
                   title
               }
           </div>
           {more&&<span className="more" onClick={()=>{
               changeActionKey(title)
           }}>
               更多
           </span>}
        </div>
    )
}

export default index
