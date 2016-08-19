import React from 'react';
import classNames from 'classnames';
import { stringify } from 'query-string';
import $ from 'jquery';
import 'bootstrap';
import store from 'store';
import toastr from 'toastr';
import swal from 'sweetalert';
import Tabs from './Tabs';
import PhotoItem from './PhotoItem';
import AddPhoto from './AddPhoto';
import Loading from '../../parts/Loading';

export default class Photos extends React.Component {
  state = {
    isFetching: false,
    item: null,
    photos: null,
    isOnAddModal: false
  };

  fetchPromise = null;

  componentWillMount() {
    this.onLoad();
  };

  componentWillUnmount() {
    this.fetchPromise.cancel();
  }

  componentWillReceiveProps(nextProps) {
    this.onLoad(nextProps);
  }

  onLoad(nextProps) {
    const { routeParams } = nextProps || this.props;

    this.setState({isFetching: true});
    this.fetchPromise = fetch(`/api/photo-album/${routeParams.albumId}`)
      .then(res => res.json())
      .then(res => {
        this.setState({item: res.data});
        const query = stringify({album: res.data.album});

        return fetch(`/api/photos?${query}`);
      })
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          photos: res.data
        })
      );
  }

  handleChange = (itemKey, e) => {
    // key 이름을 통해 바로 업데이트 할 수 있는 부분들
    this.setState({
      item: {...this.state.item,
        [itemKey]: e.target.value
      }
    })
  };

  handleClickAddItem = () => {
    this.setState({isOnAddModal: true}, () => {
      $('#add-photo-modal').modal();
    });
  };

  handleAdded = data => {
    const { item } = this.state;
    const modalEl = $('#add-photo-modal');

    const postData = {
      group: item.group,
      album: item.album,
      image: data.image,
      thumb: data.thumb
    };

    this.fetchPromise = fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.get('token')}`
        },
        body: JSON.stringify(postData)
      })
      .then(res => res.json())
      .then(res => {
        modalEl.modal('hide');
        modalEl.on('hidden.bs.modal', () => {
          this.setState({
            isOnAddModal: false,
            photos: [...this.state.photos, res.data]
          });
        });
      });
  };

  handleRemoveItem = photo => {
    // 관련 컨텐츠 삭제
    swal({
      title: "정말로 삭제하시겠습니까?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }, isConfirm => {
      if (!isConfirm) return;
      this.fetchPromise = fetch(`/api/photos/${photo._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.get('token')}`
        }
      })
      .then(() => {
        this.setState({
          photos: this.state.photos
            .filter(n => n._id !== photo._id)
        });
      });
    });
  };

  render() {
    const { isFetching, item, photos, isOnAddModal } = this.state;
    const albumId = this.props.routeParams.albumId;

    return (
      <div className="video-detail photos-detail">

        <Tabs
          albumId={albumId}
          pathname={this.props.location.pathname}
        />

        {isFetching ?
          <Loading />
        :
          <div>
            <div className="title-area">
              <h2>
                <input type="text"
                  className="inherit-form-control"
                  required
                  defaultValue={item.album}
                  onChange={this.handleChange.bind(this, 'album')}
                />
              </h2>
            </div>

            <div className="contents">
              {photos.map(item => (
                <div key={item._id} className="item item-square">
                  <div className="thumb"
                    style={{backgroundImage: `url(${item.thumb || item.image})`}}
                  >
                  </div>
                  <button type="button" className="btn-close btn btn-xs btn-default"
                    onClick={this.handleRemoveItem.bind(this, item)}
                  >
                    <i className="fa fa-times" aria-hidden="true" />
                  </button>
                </div>
              ))}
              <div className="item item-square add-item"
                onClick={this.handleClickAddItem}
              >
                <i className="fa fa-plus" aria-hidden="true" />
              </div>
            </div>

            {isOnAddModal &&
              <AddPhoto
                id="add-photo-modal"
                onAdded={this.handleAdded}
              />
            }
          </div>
        }

      </div>
    );
  }
}
