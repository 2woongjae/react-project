import React from 'react';
import store from 'store';
import toastr from 'toastr';
import { stringify } from 'query-string';
import Sortable from 'react-anything-sortable';
import SortableItem from '../../parts/SortableItem';
import MusicItem from './MusicItem';
import Loading from '../../parts/Loading';

export default class MusicContents extends React.Component {
  static propTypes = {
    category: React.PropTypes.string,
    sort: React.PropTypes.string
  };

  state = {
    isFetching: false,
    isSortChangeFetching: false,
    items: []
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
    const { category, sort, album } = nextProps || this.props;
    const query = stringify({
      category,
      sort,
      q: album
    });

    this.setState({isFetching: true});
    this.fetchPromise = fetch(`/api/music?${query}`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          items: res.data
        })
      );
  }

  handleDragDrop = (items) => {
    /*
    * 컨텐츠 rank 변경
    * array 안에 object 또는 그 object 안에 array 안에 object 데이터를 조작해야
    * 하기 때문에 mongodb 셀렉터와 변경할 데이터를 생성해서 넘기도록 작업
    * [{selector: 'categories._id', $set: {'categories._id': '5731c37cdddba3e4318dc0b7'}}]
    * 형태의 데이터로 생성
    */

    // 데이터 변경이 없을 경우 리턴
    if (items.map(i => i._id).join() === this.state.items.map(i => i._id).join())
      return;

    const { category, sort } = this.props;

    const putData = items.map((item, i) => {
      // 데이터 업데이트 위한 셀렉터
      const selector = {
        _id: item._id
      };
      if (category) {
        selector['categories._id'] = item.categories
          .find(c => c.name === category)._id;
      }

      // 데이터를 업데이트 하기 위한 $set 의 키를 생성
      const setKey = category ? `categories.$.${sort}` : sort;

      // 해당 아이템의 배치 순서
      const rank = items.length - i;

      return {
        selector,
        $set: {[setKey]: rank}
      };
    });

    this.setState({isSortChangeFetching: true});

    this.fetchPromise = fetch('/api/music', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.get('token')}`
        },
        body: JSON.stringify(putData)
      })
        .then(res => res.json())
        .then(() => {
          toastr.success('Success!');
          this.setState({isSortChangeFetching: false});
        });

    // 현재 state 에 반영
    this.setState({items});
  };

  render() {
    const { isFetching, isSortChangeFetching, items } = this.state;

    if (isFetching) return (
      <Loading />
    );

    return (
      <div className="contents">
        <Sortable
          dynamic
          onSort={this.handleDragDrop}
        >
          {items.map(item =>
            <SortableItem key={item._id} sortData={item}>
              <MusicItem
                item={item}
              />
            </SortableItem>
          )}
        </Sortable>

        {isSortChangeFetching &&
          <Loading />
        }
      </div>
    );
  }
}
