import React, { Component } from "react";
import { Player } from 'video-react';
import Hls from "hls.js";
import cover from './video_cover.png';
import "../../node_modules/video-react/dist/video-react.css";
// export default class VideoPlayer extends Component {

//   componentDidMount() {
//     instantiate Video.js
//     this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
//       console.log('onPlayerReady', this)
//     });
//   }

//   // destroy player on unmount
//   componentWillUnmount() {
//     if (this.player) {
//       this.player.dispose()
//     }
//   }

//   // wrap the player in a div with a `data-vjs-player` attribute
//   // so videojs won't create additional wrapper in the DOM
//   // see https://github.com/videojs/video.js/pull/3856
//   render() {
//     return (
//       <div>
//         <div data-vjs-player>
//           <video ref={ node => this.videoNode = node } className="video-js"></video>
//         </div>
//       </div>
//     )
//   }
// }

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);
    this.hls = new Hls();
  }

  componentDidMount() {
    // 'src' is the property get from this component
    // 'video' is the property inset from 'video' component
    // 'video' is the html5 video element
    const { src, video } = this.props;
    // load hls video source base on hls.js
    if (Hls.isSupported()) {
      this.hls.loadSource(src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  }

  componentWillMount() {
    // destory hls video source
    if (this.hls) {
      this.hls.destroy();
    }
  }

  render() {
    return (
      // <Player ref="player" poster={cover}>
      <Player ref="player" poster={this.props.poster}>
        <source 
          src={this.props.src}
          type={this.props.type || 'application/x-mpegURL'}
        />
      </Player>
    );
  }
}
