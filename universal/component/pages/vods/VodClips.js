import React from 'react';
import classNames from 'classnames';
import store from 'store';
import toastr from 'toastr';
import Sortable from 'react-anything-sortable';
import TagsInput from 'react-tagsinput';
import Tabs from './Tabs';
import RatingStar from '../../parts/RatingStar';
import Loading from '../../parts/Loading';
import FileUploader from '../../parts/FileUploader';
import Video from '../../parts/Video';
import SortableItem from '../../parts/SortableItem';

export default class VodClips extends React.Component {
  state = {
    isFetching: false,
    item: {
      rate: 1,
      title: null,
      clip: []
    }
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
    this.fetchPromise = fetch(`/api/vods/${routeParams.vodId}`)
      .then(res => res.json())
      .then(res => {
        let item = {};
        Object.keys(this.state.item).map(key => {
          item[key] = res.data[key];
        });

        this.setState({
          isFetching: false,
          item
        })
      });
  }

  handleChange = (itemKey, e) => {
    // key 이름을 통해 바로 업데이트 할 수 있는 부분들
    this.setState({
      item: {...this.state.item,
        [itemKey]: e.target.value
      }
    })
  };

  handleChangeRate = rate => {
    // 별점 수정
    this.setState({
      item: {...this.state.item,
        rate
      }
    });
  };

  handleDragDrop = (clip) => {
    // 클립 컨텐츠 순서 변경
    this.setState({
      item: {...this.state.item,
        clip
      }
    });
  };

  onCompleteImageUpload = (...args) => {
    const [i, image] = args;
    const clip = [...this.state.item.clip || []];
    clip[i] = clip[i] || {};
    clip[i].image = image;

    this.setState({
      item: {...this.state.item,
        clip
      }
    });
  };

  onCompleteVideoUpload = (...args) => {
    const [i, video] = args;
    const clip = [...this.state.item.clip || []];
    clip[i] = clip[i] || {};
    clip[i].video = video;

    this.setState({
      item: {...this.state.item,
        clip
      }
    });
  };

  handleChangeClipTitle = (i, e) => {
    const clip = [...this.state.item.clip || []];
    clip[i] = clip[i] || {};
    clip[i].title = e.target.value;

    this.setState({
      item: {...this.state.item,
        clip
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    fetch(`/api/vods/${this.props.routeParams.vodId}`, {
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

  render() {
    const { isFetching, item } = this.state;

    return (
      <div className="video-detail vod-detail">

        <Tabs
          vodId={this.props.routeParams.vodId}
          pathname={this.props.location.pathname}
        />

        {isFetching ?
          <Loading />
        :
          <form method="post"
            onSubmit={this.handleSubmit}
          >

            <div className="title-area">
              <RatingStar
                className="rating-star"
                currentRating={item.rate}
                max={5}
                onChange={this.handleChangeRate}
              />

              <h2>
                <input type="text"
                  className="inherit-form-control"
                  required
                  defaultValue={item.title}
                  onChange={this.handleChange.bind(this, 'title')}
                />
              </h2>
            </div>

            <div className="clips-area">
              <Sortable
                dynamic
                sortHandle="title"
                onSort={this.handleDragDrop}
              >
                {[0, 1, 2].map((i) => {
                  const clip = item.clip[i] || {};

                  return (
                    <SortableItem key={i} className="trailer" sortData={clip}>
                      <div className="thumb"
                        style={{backgroundImage: `url(${clip.image})`}}
                      >
                        <div className="file-upload-area">
                          <FileUploader
                            container="/vods/clips/image"
                            accept="image/*"
                            acceptedFiles={['.jpg', '.jpeg', '.png']}
                            required={clip.image ? false : true}
                            onComplete={this.onCompleteImageUpload.bind(this, i)}
                          >
                            <span className="file-btn-area">
                              <span className="btn btn-default" />
                              <i className="fa fa-picture-o" />
                            </span>
                          </FileUploader>
                          <FileUploader
                            container="/vods/clips/video"
                            accept="video/*"
                            acceptedFiles={['.mp4']}
                            required={clip.video ? false : true}
                            onComplete={this.onCompleteVideoUpload.bind(this, i)}
                          >
                            <span className="file-btn-area">
                              <span className="btn btn-default" />
                              <i className="fa fa-video-camera" />
                            </span>
                          </FileUploader>
                        </div>
                        {clip.video &&
                          <div className="video-area">
                            <Video
                              src={clip.video}
                            />
                          </div>
                        }
                      </div>
                      <div className="title">
                        <input type="text"
                          className="inherit-form-control"
                          required
                          defaultValue={clip.title}
                          onChange={this.handleChangeClipTitle.bind(this, i)}
                        />
                      </div>
                    </SortableItem>
                  )
                })}
              </Sortable>
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
