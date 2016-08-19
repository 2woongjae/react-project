import React from 'react';
import classNames from 'classnames';
import store from 'store';
import toastr from 'toastr';
import Textarea from 'react-textarea-autosize';
import Tabs from './Tabs';
import RatingStar from '../../parts/RatingStar';
import Loading from '../../parts/Loading';
import FileUploader from '../../parts/FileUploader';
import Video from '../../parts/Video';
import TagsInputRequired from '../../parts/TagsInputRequired';
import Autocomplete from '../../parts/Autocomplete';
import { musicCategories } from '../../../../utils/staticData';

export default class MusicOverview extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    isFetching: false,
    item: {
      rate: 1,
      director: [],
      cast: [],
      categories: [],
      isHotTag: false,
      isNewTag: false,
      age: 0
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
    this.fetchPromise = fetch(`/api/music/${routeParams.musicId}`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          item: res.data
        })
      );
  }

  get isUpdate() {
    return !!this.props.routeParams.musicId;
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
    if (!categories) return musicCategories;

    return musicCategories
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

  handleChangeAutocomplete = item => {
    // 뮤직 데이터 중 가져와도 되는 데이터만 가져옴
    this.setState({
      item: {...this.state.item,
        album: item.album,
        image: item.image,
        categories: item.categories,
        singer: item.singer
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

  onCompleteAudioUpload = file => {
    this.setState({
      item: {...this.state.item,
        file
      }
    });
  };

  handleChangeNewCategory = e => {
    // 카테고리 선택 시 새 카테고리 추가
    const { value } = e.target;
    if (!value) return;

    const item = {...this.state.item};
    const category = musicCategories.find(c => c.name === value);
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

  addMusic = () => {
    // 새 music 추가
    fetch(`/api/music`, {
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
        this.context.router.push(`/music/${res.data._id}/overview`);
      });
  };

  updateMusic = () => {
    // music 데이터 업데이트
    fetch(`/api/music/${this.props.routeParams.musicId}`, {
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

    if (this.isUpdate) return this.updateMusic();
    this.addMusic();
  };

  render() {
    const { isFetching, item } = this.state;

    return (
      <div className="video-detail music-detail">

        <Tabs
          album={item.album}
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
                  placeholder="Music Title"
                  required
                  value={item.title || ''}
                  onChange={this.handleChange.bind(this, 'title')}
                />
              </h2>
            </div>

            <div className="add-vod-autocomplete container">
              <Autocomplete
                type="music"
                label="앨범명 / 노래 제목 검색하여 앨범에 추가"
                placeholder="앨범명 / 노래 제목을 입력해주세요"
                items={[item]}
                textField="album"
                onChange={this.handleChangeAutocomplete}
              />

              <div className="api-autocomplete">
                <label>
                  이 음악의 앨범명
                  <input type="text" className="form-control input-md"
                    value={item.album || ''}
                    placeholder="앨범명 직접 작성"
                    onChange={this.handleChange.bind(this, 'album')}
                  />
                </label>
              </div>
            </div>

            <div className="container">
              <div className="feature-area">
                <div className="trailer">
                  <div className="thumb"
                    style={{backgroundImage: `url(${item.image})`}}
                  >
                    <div className="file-upload-area">
                      <FileUploader
                        container="/music/image"
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
                        container="/music/file"
                        accept="audio/*"
                        acceptedFiles={['.mp3']}
                        required={item.file ? false : true}
                        onComplete={this.onCompleteAudioUpload}
                      >
                        <span className="file-btn-area">
                          <span className="btn btn-default" />
                          <i className="fa fa-music" />
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
                    {item.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="content-area container">
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
                      {musicCategories.map(category =>
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
                  Singer:
                  <input type="text" className="form-control input-md"
                    value={item.singer || ''}
                    onChange={this.handleChange.bind(this, 'singer')}
                  />
                </label>
              </div>

              <label className="story">
                Lyric:
                <Textarea
                  className={classNames({'inherit-form-control': item.lyric, 'form-control': !item.lyric})}
                  value={item.lyric || ''}
                  placeholder="Lyric"
                  onChange={this.handleChange.bind(this, 'lyric')}
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
