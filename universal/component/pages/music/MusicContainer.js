import React from 'react';
import { Link } from 'react-router';
import { stringify } from 'query-string';
import MusicContents from './MusicContents';

export default class MusicContainer extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  handleChangeSort = e => {
    const query = stringify({
      ...this.props.location.query,
      sort: e.target.value
    });
    this.context.router.push(`/music?${query}`);
  };

  render() {
    const { category, sort } = this.props.location.query;

    return (
      <div className="item-container">
        <h2 className="content-title header-text">
          Music Contents

          {category ?
            <span className="sub-header">
              {category}
            </span>
          :
            <Link to="/music/add" className="btn-add btn btn-sm btn-default">
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
            <option value="hotRank">Hot</option>
          </select>
        </div>

        <MusicContents
          category={category}
          sort={sort}
        />
      </div>
    );
  }
}
