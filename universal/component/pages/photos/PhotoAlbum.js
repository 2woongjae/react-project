import React from 'react';
import { Link } from 'react-router';
import PhotoContents from './PhotoContents';

export default class PhotoAlbums extends React.Component {
  render() {
    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          Photo Album
        </h2>

        <PhotoContents />
      </div>
    );
  }
}
