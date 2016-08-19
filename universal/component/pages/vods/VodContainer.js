import React from 'react';
import { Link } from 'react-router';
import { stringify } from 'query-string';
import VideoContents from '../../parts/VideoContents';

export default class VodContainer extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  handleChangeSort = e => {
    const query = stringify({
      ...this.props.location.query,
      sort: e.target.value
    });
    this.context.router.push(`/vods?${query}`);
  };

  render() {
    const { category, category2th, sort } = this.props.location.query;

    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          VOD Contents

          {category ?
            <span className="sub-header">
              {category}
              {category2th &&
                ` > ${category2th}`
              }
            </span>
          :
            <Link to="/vods/add" className="btn-add btn btn-sm btn-default">
              add
            </Link>
          }
        </h2>

        <div className="bunch">
          <select className="inherit-form-control"
            onChange={this.handleChangeSort}
          >
            <option value="newRank">New Release</option>
            <option value="recRank">Recommended</option>
          </select>
        </div>

        <VideoContents
          type="vods"
          category={category}
          category2th={category2th}
          sort={sort}
        />
      </div>
    );
  }
}
