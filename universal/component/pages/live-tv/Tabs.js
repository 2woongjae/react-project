import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class Tabs extends React.Component {
  static propTypes = {
    liveTvId: React.PropTypes.string,
    pathname: React.PropTypes.string.isRequired
  };

  render() {
    const { liveTvId, pathname } = this.props;

    return (
      <div className="container">
        <ul className="tabs">
          <li>
            <Link
              to={`/live-tv/${liveTvId ? `${liveTvId}/overview` : 'add'}`}
              className={classNames({active: pathname.endsWith('overview') || pathname.endsWith('add')})}
            >
              Overview
            </Link>
          </li>
          <li>
            {liveTvId ?
              <Link
                to={`/live-tv/${liveTvId}/clips`}
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
            {liveTvId ?
              <Link
                to={`/live-tv/${liveTvId}/related`}
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
