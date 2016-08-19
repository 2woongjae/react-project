import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class Tabs extends React.Component {
  render() {
    const { album } = this.props;

    return (
      <div className="container">
        <ul className="tabs">
          <li>
            {album ?
              <Link to={`/music-album/${album}`} activeClassName="active">
                Album
              </Link>
            :
              <span className="a">
                Album
              </span>
            }
          </li>
        </ul>
      </div>
    );
  }
}
