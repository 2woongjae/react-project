import React from 'react';
import store from 'store';
import toastr from 'toastr';
import Textarea from 'react-textarea-autosize';
import ReviewItem from './ReviewItem';
import Loading from '../../parts/Loading';
import RatingStar from '../../parts/RatingStar';

export default class ReviewContainer extends React.Component {
  static propTypes = {
    vodId: React.PropTypes.string.isRequired
  };

  state = {
    isFetching: false,
    item: {
      rate: 1
    },
    items: []
  };

  componentWillMount() {
    const { vodId } = this.props;

    this.setState({isFetching: true});
    this.fetchPromise = fetch(`/api/review?vodId=${vodId}`)
      .then(res => res.json())
      .then(res =>
        this.setState({
          isFetching: false,
          items: res.data
        })
      );
  }

  handleChangeRate = rate => {
    // 별점 수정
    this.setState({
      item: {...this.state.item,
        rate
      }
    });
  };

  handleChange = (itemKey, e) => {
    // key 이름을 통해 바로 업데이트 할 수 있는 부분들
    this.setState({
      item: {...this.state.item,
        [itemKey]: e.target.value
      }
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const postData = {
      vodId: this.props.vodId,
      ...this.state.item
    };

    // 리뷰 추가
    fetch(`/api/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.get('token')}`
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(res => {
        toastr.success('Added!');
        this.setState({
          items: [res.data, ...this.state.items]
        });
      });
  };

  handleRemoveItem = item => {
    // 리뷰 삭제
    swal({
      title: "정말로 삭제하시겠습니까?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }, isConfirm => {
      if (!isConfirm) return;
      this.fetchPromise = fetch(`/api/review/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.get('token')}`
        }
      })
        .then(res => res.json())
        .then(() => {
          this.setState({
            items: this.state.items
              .filter(n => n._id !== item._id)
          });
        });
    });
  };

  render() {
    const { isFetching, item } = this.state;

    if (isFetching)
      return (
        <Loading />
      );

    return (
      <div className="reviews container">
        <h2 className="m-top-lg">reviews</h2>
        <div className="review-write">
          <form
            onSubmit={this.handleSubmit}
          >
            <div className="author-area m-bottom-sm">
              <input type="text" className="author form-control"
                placeholder="Author"
                required
                onChange={this.handleChange.bind(this, 'author')}
              />
              <RatingStar
                className="rating-star"
                currentRating={item.rate}
                max={5}
                onChange={this.handleChangeRate}
              />
            </div>
            <div className="title">
              <input type="text" className="form-control"
                placeholder="Title"
                required
                onChange={this.handleChange.bind(this, 'title')}
              />
            </div>
            <div className="textarea m-top-sm m-bottom-sm">
              <Textarea
                className="form-control"
                placeholder="review"
                required
                minRows={3}
                onChange={this.handleChange.bind(this, 'content')}
              />
            </div>
            <div className="text-right">
              <button type="submit" className="btn btn-info">
                Write
              </button>
            </div>
          </form>
        </div>
        {this.state.items.map(item =>
          <div key={item._id} className="review-item">
            <ReviewItem
              item={item}
            />
            <button type="button" className="btn-close btn btn-xs btn-default"
              onClick={this.handleRemoveItem.bind(this, item)}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
