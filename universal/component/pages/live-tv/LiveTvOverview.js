import React from 'react';
import classNames from 'classnames';
import store from 'store';
import toastr from 'toastr';
import Textarea from 'react-textarea-autosize';
import TagsInputComponent from 'react-tagsinput';
import Tabs from './Tabs';
import RatingStar from '../../parts/RatingStar';
import Loading from '../../parts/Loading';
import FileUploader from '../../parts/FileUploader';
import Video from '../../parts/Video';
import Autocomplete from '../../parts/Autocomplete';
import {
  videoAges, liveTvCategories, liveTvChannels, liveTvBroadcasts
} from '../../../../utils/staticData';

export default class LiveTvOverview extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    isFetching: false,
    item: {
      rate: 1,
      title: null,
      image: null,
      video: null,
      age: 0,
      isHotTag: false,
      isNewTag: false,
      channel: null,
      broadcast: null,
      categories: [],
      director: [],
      cast: [],
      story: null
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
    this.fetchPromise = fetch(`/api/live-tv/${routeParams.liveTvId}`)
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

  get isUpdate() {
    return !!this.props.routeParams.liveTvId;
  }

  get categories() {
    // 뷰 출력용 카테고리
    const categories = [];
    ((this.state.item || {}).categories || []).forEach(category => {
      categories.push(category);
    });

    return categories;
  }

  get newCategories() {
    // 새 카테고리 추가용 카테고리
    const { categories } = this;
    if (!categories) return liveTvCategories;

    return liveTvCategories
      .filter(c => {
        // 현재 카테고리가 추가된 상태라면 필터
        const hasCategory1th = categories.find(ca => ca.name === c.name);
        return !hasCategory1th;
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

  handleChangeAutocomplete = vodItem => {
    // VOD 데이터 중 가져와도 되는 데이터만 가져옴
    delete vodItem.categories;
    let item = {...this.state.item, clip: null};
    Object.keys(item).map(key => {
      if (typeof vodItem[key] !== 'undefined')
        item[key] = vodItem[key];
    });

    this.setState({
      item
    });
  };

  onCompleteImageUpload = image => {
    this.setState({
      item: {...this.state.item,
        image
      }
    });
  };

  onCompleteVideoUpload = video => {
    this.setState({
      item: {...this.state.item,
        video
      }
    });
  };

  handleChangeNewCategory = e => {
    // 카테고리 선택 시 새 카테고리 추가
    const { value } = e.target;
    if (!value) return;

    const item = {...this.state.item};
    const category = liveTvCategories.find(c => c.name === value);
    item.categories.push({
      name: category.name
    });
    this.setState({item});
  };

  handleRemoveCategory = category => {
    // 카테고리 삭제하기
    const item = {...this.state.item};
    item.categories = item.categories.filter(c => c.name !== category.name);
    this.setState({item});
  };

  handleChangeTag = (tagKey, e) => {
    this.setState({
      item: {...this.state.item,
        [tagKey]: e.target.checked
      }
    });
  };

  handleChangeDirector = director => {
    this.setState({
      item: {...this.state.item,
        director
      }
    });
  };

  handleChangeCast = cast => {
    this.setState({
      item: {...this.state.item,
        cast
      }
    });
  };

  addLiveTv = () => {
    // 새 liveTv 추가
    fetch(`/api/live-tv`, {
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
        this.context.router.push(`/live-tv/${res.data._id}/overview`);
      });
  };

  updateLiveTv = () => {
    // liveTv 데이터 업데이트
    fetch(`/api/live-tv/${this.props.routeParams.liveTvId}`, {
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

    if (this.isUpdate) return this.updateLiveTv();
    this.addLiveTv();
  };

  render() {
    const { isFetching, item } = this.state;

    return (
      <div className="video-detail live-tv-detail">

        <Tabs
          liveTvId={this.props.routeParams.liveTvId}
          pathname={this.props.location.pathname}
        />

        {isFetching ?
          <Loading />
        :
          <form method="post"
            onSubmit={this.handleSubmit}
          >

            <div className="title-area container">
              <RatingStar
                className="rating-star"
                currentRating={item.rate}
                max={5}
                onChange={this.handleChangeRate}
              />

              <h2>
                <input type="text"
                  className="inherit-form-control"
                  placeholder="Live TV Title"
                  required
                  value={item.title || ''}
                  onChange={this.handleChange.bind(this, 'title')}
                />
              </h2>
            </div>

            {!this.isUpdate &&
              <div className="add-vod-autocomplete container">
                <Autocomplete
                  type="vods"
                  label="VOD 데이터 가져오기"
                  placeholder="가져올 VOD 이름을 입력해주세요"
                  disabled={!!item.title}
                  onChange={this.handleChangeAutocomplete}
                />
              </div>
            }

            <div className="container">
              <div className="feature-area">
                <div className="trailer">
                  <div className="thumb"
                    style={{backgroundImage: `url(${item.image})`}}
                  >
                    <div className="file-upload-area">
                      <FileUploader
                        container="/live-tv/image"
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
                      <FileUploader
                        container="/live-tv/video"
                        accept="video/*"
                        acceptedFiles={['.mp4']}
                        required={item.video ? false : true}
                        onComplete={this.onCompleteVideoUpload}
                      >
                        <span className="file-btn-area">
                          <span className="btn btn-default" />
                          <i className="fa fa-video-camera" />
                        </span>
                      </FileUploader>
                    </div>
                    {item.video &&
                      <div className="video-area">
                        <Video
                          src={item.video}
                        />
                      </div>
                    }
                  </div>
                  <div className="title">
                    {item.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="content-area container">
              <label className="box">
                <i className="glyphicon glyphicon-sunglasses"></i>
                <select
                  className="inherit-form-control"
                  value={item.age || 0}
                  onChange={this.handleChange.bind(this, 'age')}
                >
                  {videoAges.map(val =>
                    <option key={val} value={val}>{val}</option>
                  )}
                </select>
              </label>
              <span className="box">
                <label>
                  <input type="checkbox"
                    checked={item.isNewTag}
                    onChange={this.handleChangeTag.bind(this, 'isNewTag')}
                  />
                  new
                </label>
              </span>
              <span className="box">
                <label>
                  <input type="checkbox"
                    checked={item.isHotTag}
                    onChange={this.handleChangeTag.bind(this, 'isHotTag')}
                  />
                  hot
                </label>
              </span>
              <span className="box">
                <label>
                  <i>ch</i>
                  <select
                    className="inherit-form-control"
                    value={item.channel || ''}
                    required
                    onChange={this.handleChange.bind(this, 'channel')}
                  >
                    <option value="">Choose</option>
                    {liveTvChannels.map(val =>
                      <option key={val} value={val}>{val}</option>
                    )}
                  </select>
                </label>
              </span>
              <span className="box">
                <label>
                  <i className="fa fa-wifi" aria-hidden="true" />
                  <select
                    className="inherit-form-control"
                    value={item.broadcast || ''}
                    required
                    onChange={this.handleChange.bind(this, 'broadcast')}
                  >
                    <option value="">Choose a channel</option>
                    {liveTvBroadcasts.map(val =>
                      <option key={val} value={val}>{val}</option>
                    )}
                  </select>
                </label>
              </span>

              <div className="categories">
                {this.categories.map((category, i) =>
                  <div key={`${category.name}-${i}`}>
                    <button className="btn btn-none btn-modify"
                      onClick={this.handleRemoveCategory.bind(this, category)}
                    >
                      <i className="fa fa-minus" />
                    </button>

                    <select
                      className="inherit-form-control"
                      defaultValue={category.name}
                    >
                      {liveTvCategories.map(category =>
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      )}
                    </select>
                  </div>
                )}

                <div className="new-category">
                  <span className="btn btn-none btn-modify">
                    <i className="fa fa-plus" />
                  </span>

                    <select
                      className="inherit-form-control"
                      value={''}
                      required={this.categories.length === 0}
                      onChange={this.handleChangeNewCategory}
                    >
                      <option value="">Choose a category</option>
                      {this.newCategories.map(category =>
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      )}
                    </select>

                </div>
              </div>

              <div className="staff">
                <label>
                  Director:
                  <TagsInputComponent
                    value={item.director}
                    addOnBlur={true}
                    onChange={this.handleChangeDirector}
                  />
                </label>
                <label>
                  Cast:
                  <TagsInputComponent
                    value={item.cast}
                    addOnBlur={true}
                    onChange={this.handleChangeCast}
                  />
                </label>
              </div>

              <label className="story">
                Story:
                <Textarea
                  className={classNames({'inherit-form-control': item.story, 'form-control': !item.story})}
                  value={item.story || ''}
                  placeholder="Story"
                  onChange={this.handleChange.bind(this, 'story')}
                />
              </label>
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
