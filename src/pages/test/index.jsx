import React from 'react';
import ReactAplayer from 'react-aplayer';

export default class App extends React.Component {
    // event binding example
    onPlay = () => {
        console.log('on play');
    };

    onPause = () => {
        console.log('on pause');
    };

    // example of access aplayer instance
    onInit = ap => {
        this.ap = ap;
    };

    render() {
        const props = {
            theme: '#F57F17',
            lrcType: 3,
            audio: [
                {
                    name: '光るなら',
                    artist: 'Goose house',
                    url: 'https://voice.tieus.org/upload/MP3/20190330/950a17d4dab2fcf1cfb01d546776caf8.mp3',
                    cover: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.jpg',
                    lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.lrc',
                    theme: '#ebd0c2'
                }
            ]
        };

        return (
            <div>
                <ReactAplayer
                    {...props}
                    onInit={this.onInit}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                />
                {/* example of access aplayer instance API */}
                <button onClick={() => this.ap.toggle()}>toggle</button>
            </div>
        );
    }
}