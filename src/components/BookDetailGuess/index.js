import React from 'react'

function index(porps) {
    return (
        <div className='bookDetailGuess'>
            <div className="img" onClick={()=>{
                porps.getBooKDetail(porps.id)
            }}>
                <img src={porps.poster} alt="" className='guessImg' />
            </div>
            <div className="right">
                <p className='rightTitle'>
                    {porps.title}
                </p>
                <div className="guessContent">
                    <div className="play">
                        <img src={require('../../assets/images/history_play_ico.png')} alt="" />
                        <span>
                            {porps.play}
                        </span>
                    </div>
                    <div className="love">
                        <img src={require('../../assets/images/history_like_ico.png')} alt="" />
                        <span>
                            {porps.love}
                        </span>
                    </div>
                </div>
                <div className="label">
                    {porps.label}
                </div>
            </div>
        </div>
    )
}

export default index
