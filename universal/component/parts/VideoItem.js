import React from 'react';
import { Link } from 'react-router';

export default class VideoItem extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,  // api 타입 (vods, live-tv, ...)
    item: React.PropTypes.object.isRequired
  };

  render() {
    const { type, item } = this.props;

    return (
      <div className="item">
        <Link to={`/${type}/${item._id}/overview`}>
          {item.isNewTag &&
            <span className="new">NEW</span>
          }
          {item.rate &&
            <span className="rate">{item.rate.toFixed(1)}</span>
          }
          <div className="thumb"
            style={{backgroundImage: `url(${item.image})`}}
          >
          </div>
          <div className="title">
            {item.title}
            {item.isSaleTag &&
              <span className="sale">할인</span>
            }
          </div>
        </Link>
      </div>
    );
  }
}
