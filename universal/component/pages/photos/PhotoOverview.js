import React from 'react';
import classNames from 'classnames';
import store from 'store';
import toastr from 'toastr';
import Tabs from './Tabs';
import RatingStar from '../../parts/RatingStar';
import Loading from '../../parts/Loading';
import FileUploader from '../../parts/FileUploader';
import Autocomplete from '../../parts/Autocomplete';

export default class PhotoOverview extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    isFetching: false,
    item: {
      album: '',
      isNewTag: false
    }
  };

  fetchPromise = null;

  componentWillMount() {
    this.onLoad();
  };

  componentWillUnmount() {
    if (this.fetchPromise) this.fetchPromise.cancel();
  }

  componentWillReceiveProps(nextProps) {
    this.onLoad(nextProps);
  }

  onLoad(nextProps) {
    const { routeParams } = nextProps || this.props;
    if (!this.isUpdate) return;

    this.setState({isFetching: true});
    this.fetchPromise = fetch(`/api/photo-album/${routeParams.albumId}`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          item: res.data
        })
      );
  }

  get isUpdate() {
    return !!this.props.routeParams.albumId;
  }

  handleChange = (itemKey, e) => {
    // key 이름을 통해 바로 업데이트 할 수 있는 부분들
    this.setState({
      item: {...this.state.item,
        [itemKey]: e.target.value
      }
    })
  };

  handleChangeTag = (tagKey, e) => {
    this.setState({
      item: {...this.state.item,
        [tagKey]: e.target.checked
      }
    });
  };

  onCompleteImageUpload = image => {
    this.setState({
      item: {...this.state.item,
        image
      }
    });
  };

  addPhoto = () => {
    // 새 photo 추가
    fetch(`/api/photo-album`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.get('token')}`
      },
      body: JSON.stringify(this.state.item)
    })
      .then(res => res.json())
      .then(res => {
        toastr.success('Added!');
        this.context.router.push(`/photo-album/${res.data._id}/overview`);
      });
  };

  updatePhoto = () => {
    // photo 데이터 업데이트
    fetch(`/api/photo-album/${this.props.routeParams.albumId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.get('token')}`
      },
      body: JSON.stringify(this.state.item)
    })
      .then(res => res.json())
      .then(res => toastr.success('Saved!'));
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.isUpdate) return this.updatePhoto();
    this.addPhoto();
  };

  render() {
    const { isFetching, item } = this.state;

    return (
      <div className="video-detail photos-detail">

        <Tabs
          albumId={this.props.routeParams.albumId}
          pathname={this.props.location.pathname}
        />

        {isFetching ?
          <Loading />
        :
          <form method="post"
            onSubmit={this.handleSubmit}
          >

            <div className="title-area container">
              <h2>
                <input type="text"
                  className="inherit-form-control"
                  placeholder="Photo Album Title"
                  required
                  value={item.album || ''}
                  onChange={this.handleChange.bind(this, 'album')}
                />
              </h2>
            </div>

            <div className="container">
              <div className="feature-area">
                <div className="trailer">
                  <div className="thumb"
                    style={{backgroundImage: `url(${item.image})`}}
                  >
                    <div className="file-upload-area">
                      <FileUploader
                        container="/photos/album"
                        accept="image/*"
                        acceptedFiles={['.jpg', '.jpeg', '.png']}
                        required={item.image ? false : true}
                        onComplete={this.onCompleteImageUpload}
                      >
                        <span className="file-btn-area">
                          <span className="btn btn-default" />
                          <i className="fa fa-picture-o" />
                        </span>
                      </FileUploader>
                    </div>
                    {item.file &&
                      <div className="video-area">
                        <Video
                          src={item.file}
                        />
                      </div>
                    }
                  </div>
                  <div className="title">
                    {item.album}
                  </div>
                </div>
              </div>
            </div>

            <div className="content-area container">
              <span className="box">
                <label>
                  <input type="checkbox"
                    checked={item.isNewTag}
                    onChange={this.handleChangeTag.bind(this, 'isNewTag')}
                  />
                  new
                </label>
              </span>
            </div>

            <div className="btn-area">
              <button type="submit" className="btn btn-info">
                Save
              </button>
            </div>

          </form>
        }

      </div>
    );
  }
}
