import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../../static/styles/videojs-sublime-skin.css';

export default class Video extends React.Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    videojs(this.refs.root, {}, function() {
      this.ready(() => {
        $(root).parent('div').removeAttr('data-reactid');
      });
    });
  }

  render() {
    const { src } = this.props;

    if (src.split('.').pop() === 'mp3')
      return (
        <audio ref="root" preload="none" controls
          src={src}
          className="video-js vjs-sublime-skin"
        >
          You'll need an HTML5 capable browser to see this content.
        </audio>
      );

    return (
      <video ref="root" preload="none" controls
        src={src}
        className="video-js vjs-sublime-skin"
      >
        You'll need an HTML5 capable browser to see this content.
      </video>
    )
  }
}
