import React from 'react';
import { stringify } from 'query-string';
import PhotoItem from './PhotoItem';
import Loading from '../../parts/Loading';

export default class PhotoContents extends React.Component {
  state = {
    isFetching: false,
    items: []
  };

  fetchPromise = null;

  componentWillMount() {
    this.onLoad();
  };

  componentWillUnmount() {
    this.fetchPromise.cancel();
  }

  onLoad() {
    this.setState({isFetching: true});
    this.fetchPromise = fetch(`/api/photo-album`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          items: res.data
        })
      );
  }

  render() {
    const { isFetching, items } = this.state;

    if (isFetching) return (
      <Loading />
    );

    return (
      <div className="contents">
        {items.map(item => (
          <PhotoItem
            key={item._id}
            item={item}
          />
        ))}
      </div>
    );
  }
}
