import React from 'react';
import { Link } from 'react-router';
import VideoContents from '../../parts/VideoContents';

export default class LiveTvContainer extends React.Component {
  render() {
    const { category, sort } = this.props.location.query;

    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          Live TV Contents

          {category ?
            <span className="sub-header">
              {category}
            </span>
          :
            <Link to="/live-tv/add" className="btn-add btn btn-sm btn-default">
              add
            </Link>
          }
        </h2>

        <VideoContents
          type="live-tv"
          category={category}
          sort={sort}
        />
      </div>
    );
  }
}
