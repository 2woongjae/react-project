import React from 'react';
import { Link } from 'react-router';
import VideoContents from '../parts/VideoContents';
import MusicContents from '../pages/music/MusicContents';

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <h2 className="content-title header-text">VTV Contents</h2>

        <h3>VOD</h3>
        <VideoContents
          type="vods"
        />

        <h3 className="m-top-lg">Live TV</h3>
        <VideoContents
          type="live-tv"
        />

        <h3 className="m-top-lg">Music</h3>
        <MusicContents />
      </div>
    );
  }
}
