import React from 'react';
import { Link } from 'react-router';

export default class PhotoItem extends React.Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  };

  render() {
    const { item } = this.props;

    return (
      <div className="item item-square">
        <Link to={`/photo-album/${item._id}/overview`}>
          <div className="thumb"
            style={{backgroundImage: `url(${item.image})`}}
          >
          </div>
          <div className="title">
            {item.album}
          </div>
        </Link>
      </div>
    );
  }
}
