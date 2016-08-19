import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class Tabs extends React.Component {
  static propTypes = {
    vodId: React.PropTypes.string,
    pathname: React.PropTypes.string.isRequired
  };

  render() {
    const { vodId, pathname } = this.props;

    return (
      <div className="container">
        <ul className="tabs">
          <li>
            <Link
              to={`/vods/${vodId ? `${vodId}/overview` : 'add'}`}
              className={classNames({active: pathname.endsWith('overview') || pathname.endsWith('add')})}
            >
              Overview
            </Link>
          </li>
          <li>
            {vodId ?
              <Link
                to={`/vods/${vodId}/clips`}
                className={classNames({active: pathname.endsWith('clips')})}
              >
                Clips / Episodes
              </Link>
            :
              <span className="a">
                Clips / Episodes
              </span>
            }
          </li>
          <li>
            {vodId ?
              <Link
                to={`/vods/${vodId}/related`}
                className={classNames({active: pathname.endsWith('related')})}
              >
                More like this
              </Link>
            :
              <span className="a">
                More like this
              </span>
            }
          </li>
        </ul>
      </div>
    );
  }
}
