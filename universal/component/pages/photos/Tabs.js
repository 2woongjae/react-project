import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class Tabs extends React.Component {
  static propTypes = {
    albumId: React.PropTypes.string,
    pathname: React.PropTypes.string.isRequired
  };

  render() {
    const { albumId, pathname } = this.props;

    return (
      <div className="container">
        <ul className="tabs">
          <li>
            <Link
              to={`/photo-album/${albumId ? `${albumId}/overview` : 'add'}`}
              className={classNames({active: pathname.endsWith('overview') || pathname.endsWith('add')})}
            >
              Overview
            </Link>
          </li>
          <li>
            {albumId ?
              <Link to={`/photo-album/${albumId}/photo`} activeClassName="active">
                Photo
              </Link>
            :
              <span className="a">
                Photo
              </span>
            }
          </li>
        </ul>
      </div>
    );
  }
}
