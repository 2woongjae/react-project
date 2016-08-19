import React from 'react';
import classNames from 'classnames';
import { stringify } from 'query-string';
import store from 'store';
import toastr from 'toastr';
import Sortable from 'react-anything-sortable';
import Tabs from './Tabs';
import RatingStar from '../../parts/RatingStar';
import Loading from '../../parts/Loading';
import Autocomplete from '../../parts/Autocomplete';
import VideoItem from '../../parts/VideoItem';
import SortableItem from '../../parts/SortableItem';

export default class VodRelated extends React.Component {
  state = {
    isFetching: false,
    item: {
      rate: 1,
      title: null,
      relateContents: []
    },
    relateContents: null
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

        this.setState({item});
        if (res.data.relateContents.length === 0)
          // 관련 컨텐츠 없으면 빈 array 리턴
          return Promise.resolve({
            json() {
              return {data: []}
            }
          });

        const ids = stringify({ids: res.data.relateContents});

        return fetch(`/api/vods?${ids}`);
      })
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          relateContents: res.data
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

  handleChangeRate = rate => {
    // 별점 수정
    this.setState({
      item: {...this.state.item,
        rate
      }
    });
  };

  handleChangeAutocomplete = (item) => {
    const relateContents = [...this.state.relateContents, item];

    this.setState({
      item: {...this.state.item,
        relateContents: relateContents.map(n => n._id)
      },
      relateContents
    });
  };

  handleDragDrop = (relateContents) => {
    // 관련 컨텐츠 순서 변경
    this.setState({
      item: {...this.state.item,
        relateContents: relateContents.map(n => n._id)
      },
      relateContents
    });
  };

  handleRemoveItem = (relateItem) => {
    // 관련 컨텐츠 삭제
    const relateContents = this.state.relateContents
      .filter(n => n._id !== relateItem._id);

    this.setState({
      item: {...this.state.item,
        relateContents: relateContents.map(n => n._id)
      },
      relateContents
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
    const { isFetching, item, relateContents } = this.state;
    const vodId = this.props.routeParams.vodId;

    return (
      <div className="video-detail vod-detail">

        <Tabs
          vodId={vodId}
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

            <Autocomplete
              type="vods"
              label="VOD 추가"
              placeholder="VOD 이름을 입력해주세요"
              items={relateContents.concat({_id: vodId})}
              onChange={this.handleChangeAutocomplete}
            />

            <div className="contents">
              <Sortable
                dynamic
                onSort={this.handleDragDrop}
              >
                {relateContents.map(item => (
                  <SortableItem key={item._id} sortData={item}>
                    <VideoItem
                      type="vods"
                      item={item}
                    />
                    <button type="button" className="btn-close btn btn-xs btn-default"
                      onClick={this.handleRemoveItem.bind(this, item)}
                    >
                      <i className="fa fa-times" aria-hidden="true" />
                    </button>
                  </SortableItem>
                ))}
              </Sortable>
            </div>

            <div className="btn-area">
              <button type="submit" className="btn btn-info"
                disabled={relateContents.length === 0}
              >
                Save
              </button>
            </div>

          </form>
        }

      </div>
    );
  }
}
