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
import ReviewContainer from './ReviewContainer';
import {
  videoAges, vodQualities, vodCategories
} from '../../../../utils/staticData';

export default class VodOverview extends React.Component {
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
      time: null,
      year: null,
      isHotTag: false,
      isNewTag: false,
      isSaleTag: false,
      categories: [],
      quality: 'FHD',
      price: '',
      expirationDate: null,
      director: [],
      cast: [],
      story: null
    },
    newCategory: null
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
    this.fetchPromise = fetch(`/api/vods/${routeParams.vodId}`)
      .then(res => res.json())
      .then(res => {
        let item = {};
        Object.keys(this.state.item).map(key => {
          item[key] = res.data[key];
        });

        this.setState({
          isFetching: false,
          item: {...item,
            categories: res.data.categories.map(c => {
              // mongoose 는 스키마에 array 있으면 무조건 빈 array 추가해서
              // 최초 로드 시 서브 카테고리 비어있으면 삭제 처리
              if (c.categories.length === 0) delete c.categories;
              return c;
            })
          }
        })
      });
  }

  get isUpdate() {
    return !!this.props.routeParams.vodId;
  }

  get categories() {
    // 뷰 출력용 카테고리
    const categories = [];
    ((this.state.item || {}).categories || []).forEach(category => {
      if (!category.categories)
        return categories.push(category);
      category.categories.forEach(subCategory => {
        categories.push({
          ...category,
          subCategory
        });
      });
    });

    return categories;
  }

  getSubCategories(category) {
    // 다른 카테고리에서 선택 중인 서브 카테고리 표시하지 않기
    // category.subCategory.name 인 경우에는 필터하지 않되,
    // this.state.items.categories 내의 sub 카테고리들은 필터해야함
    const subCategories = vodCategories
      .find(c => c.name === category.name).subCategories;

    const categories = this.categories.filter(c => c.name === category.name);
    // 현재 데이터 없으면 전체 서브 카테고리 리턴
    if (!categories.length) return subCategories;

    // 현재 데이터가 가지고 있는 서브 카테고리들
    const hasSubCategories = categories.map(c => c.subCategory.name);

    return subCategories
      .filter(c =>
        !hasSubCategories.includes(c.name) ||
        c.name === category.subCategory.name
      );
  }

  get newCategories() {
    // 새 카테고리 추가용 카테고리
    const { categories } = this;
    if (!categories) return vodCategories;

    return vodCategories
      .filter(c => {
        // 현재 1depth만 있는 카테고리가 추가된 상태라면 필터
        const hasCategory1th = categories.find(ca => ca.name === c.name);
        if (!c.subCategories) return !hasCategory1th;
        return true;
      })
      .map(c => {
        // 1depth 카테고리와 2depth 카테고리 모두 선택된 것 필터
        if (!c.subCategories) return c;
        const category = {...c};
        category.subCategories = category.subCategories.filter(c =>
          !categories.find(ca => (ca.subCategory || {}).name === c.name)
        );
        return category;
      });
  }

  get newSubCategories() {
    // 새 카테고리 추가용 서브 카테고리
    return (this.newCategories
      .find(c => c.name === this.state.newCategory) || {}).subCategories;
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
    // 1depth 카테고리 선택 시 새 카테고리 추가
    const { value } = e.target;
    if (!value) return;

    const item = {...this.state.item};
    const category = vodCategories.find(c => c.name === value);
    if (category.subCategories) {
      // 서브 카테고리 있는 경우
      this.setState({newCategory: value});
    } else {
      // 서브 카테고리 없는 경우 바로 추가
      item.categories.push({
        name: category.name
      });
      this.setState({item, newCategory: value});
    }
  };

  handleChangeNewCategory2th = e => {
    // 서브 카테고리 선택 시 새 카테고리 추가
    const { value } = e.target;
    if (!value) return;
    const { newCategory } = this.state;

    const item = {...this.state.item};
    if (item.categories.find(c => c.name === newCategory)) {
      // 기존 item 내 1depth 카테고리가 존재하는 경우 해당 배열의 아이템으로 넣어줌
      item.categories.map(c => {
        if (c.name === newCategory)
          c.categories.push({
            name: value
          });
        return c;
      })
    } else {
      // 없을 경우 새로 추가
      item.categories.push({
        name: newCategory,
        categories: [{name: value}]
      });
    }
    this.setState({newCategory: null, item});
  };

  handleChangeCategory2th = (category, category2thId, e) => {
    // 서브 카테고리 변경 시 반영
    const { value } = e.target;
    const item = {...this.state.item};
    console.log(category, value);

    item.categories.map(c => {
      if (!c.categories) return c;
      c.categories.map(c2 => {
        if (c.name === category && c2._id === category2thId) c2.name = value;
        return c2;
      });
    });
    this.setState({item});
  };

  handleRemoveCategory = category => {
    // 카테고리 삭제하기
    const item = {...this.state.item};
    let categories = item.categories;
    if (!category.subCategory)
      // 서브 카테고리 없으면 1depth 카테고리에서 제거
      categories = categories.filter(c => c.name !== category.name);
    else
      // 서브 카테고리 있으면 2dpeth 카테고리에서 제거
      categories = categories
        .map(c => {
          if (c.name !== category.name) return c;
          return {
            ...c,
            categories: c.categories
              .filter(ca => ca.name !== category.subCategory.name)
          };
        })
        .filter(c => !(c.categories && c.categories.length === 0));

    item.categories = categories;
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

  addVod = () => {
    // 새 vod 추가
    fetch(`/api/vods`, {
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
        this.context.router.push(`/vods/${res.data._id}/overview`);
      });
  };

  updateVod = () => {
    // vod 데이터 업데이트
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

  handleSubmit = e => {
    e.preventDefault();

    if (this.isUpdate) return this.updateVod();
    this.addVod();
  };

  render() {
    const {
      isFetching, item, newCategory
    } = this.state;

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
                  placeholder="VOD Title"
                  required
                  defaultValue={item.title}
                  onChange={this.handleChange.bind(this, 'title')}
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
                        container="/vods/image"
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
                        container="/vods/video"
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
                <div className="payment">
                  <span className="icon"><i className="fa fa-credit-card" /></span>
                  <span className="price">
                    <select
                      className="inherit-form-control"
                      defaultValue={item.quality}
                      onChange={this.handleChange.bind(this, 'quality')}
                    >
                      {vodQualities.map(val =>
                        <option key={val} value={val}>{val}</option>
                      )}
                    </select>
                    <input type="text"
                      className="inherit-form-control"
                      defaultValue={item.price}
                      placeholder="$0"
                      required
                      onChange={this.handleChange.bind(this, 'price')}
                    />
                  </span>
                  <span className="expired">
                    ( <input type="number"
                      className="inherit-form-control"
                      min="0"
                      max="9999"
                      defaultValue={item.expirationDate}
                      placeholder="30"
                      required
                      onChange={this.handleChange.bind(this, 'expirationDate')}
                    />
                    days )
                  </span>
                </div>
              </div>
            </div>

            <div className="content-area container">
              <label className="box">
                <i className="glyphicon glyphicon-sunglasses"></i>
                <select
                  className="inherit-form-control"
                  defaultValue={item.age}
                  onChange={this.handleChange.bind(this, 'age')}
                >
                  {videoAges.map(val =>
                    <option key={val} value={val}>{val}</option>
                  )}
                </select>
              </label>
              <span className="box">
                <input type="number"
                  className="inherit-form-control"
                  style={{width: '50px'}}
                  min="1"
                  max="1000"
                  defaultValue={item.time}
                  placeholder="151"
                  required
                  onChange={this.handleChange.bind(this, 'time')}
                /> min
              </span>
              <span className="box">
                <input type="number"
                  className="inherit-form-control"
                  style={{width: '70px'}}
                  min="1970"
                  max="2099"
                  defaultValue={item.year}
                  placeholder="1970"
                  onChange={this.handleChange.bind(this, 'year')}
                />
              </span>
              <span className="box">
                <label>
                  <input type="checkbox"
                    defaultChecked={item.isNewTag}
                    onChange={this.handleChangeTag.bind(this, 'isNewTag')}
                  />
                  new
                </label>
              </span>
              <span className="box">
                <label>
                  <input type="checkbox"
                    defaultChecked={item.isHotTag}
                    onChange={this.handleChangeTag.bind(this, 'isHotTag')}
                  />
                  hot
                </label>
              </span>
              <span className="box">
                <label>
                  <input type="checkbox"
                    defaultChecked={item.isSaleTag}
                    onChange={this.handleChangeTag.bind(this, 'isSaleTag')}
                  />
                  sale
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
                      {vodCategories.map(category =>
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      )}
                    </select>
                    {category.subCategory &&
                      <span className="sub-category">
                        <select
                          className="inherit-form-control"
                          defaultValue={category.subCategory.name}
                          onChange={this.handleChangeCategory2th.bind(this, category.name, category.subCategory._id)}
                        >
                          {this.getSubCategories(category).map(category =>
                            <option key={category.name} value={category.name}>
                              {category.name}
                            </option>
                          )}
                        </select>
                      </span>
                    }
                  </div>
                )}

                <div className="new-category">
                  <span className="btn btn-none btn-modify">
                    <i className="fa fa-plus" />
                  </span>

                  <select
                    className="inherit-form-control"
                    value={newCategory || ''}
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

                  {this.newSubCategories &&
                    <span className="sub-category">
                      <select
                        className="inherit-form-control"
                        required={this.categories.length === 0}
                        onChange={this.handleChangeNewCategory2th}
                      >
                        <option value="">Choose a category</option>
                        {this.newSubCategories.map(category =>
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        )}
                      </select>
                    </span>
                  }
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
                  defaultValue={item.story}
                  placeholder="Story"
                  onChange={this.handleChange.bind(this, 'story')}
                  minRows={item.story ? 1 : 3}
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

        {this.isUpdate &&
          <ReviewContainer
            vodId={this.props.routeParams.vodId}
          />
        }

      </div>
    );
  }
}
