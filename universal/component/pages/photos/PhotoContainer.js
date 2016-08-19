import React from 'react';
import { Link } from 'react-router';
import PhotoContents from './PhotoContents';

export default class PhotoContainer extends React.Component {
  render() {
    const { category } = this.props.location.query;

    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          Photo Contents

          {category ?
            <span className="sub-header">
              {category}
            </span>
          :
            <Link to="/photo-album/add" className="btn-add btn btn-sm btn-default">
              add
            </Link>
          }
        </h2>

        <PhotoContents
          category={category}
        />
      </div>
    );
  }
}
