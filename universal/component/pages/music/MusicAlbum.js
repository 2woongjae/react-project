import React from 'react';
import { Link } from 'react-router';
import MusicContents from './MusicContents';

export default class MusicAlbum extends React.Component {
  render() {
    const { album } = this.props.params;

    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          Music - {album}
        </h2>

        <MusicContents
          album={album}
        />
      </div>
    );
  }
}
