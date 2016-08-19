import React from 'react';
import store from 'store';
import toastr from 'toastr';
import swal from 'sweetalert';
import classNames from 'classnames';
import moment from 'moment';
import Textarea from 'react-textarea-autosize';
import RatingStar from '../../parts/RatingStar';

export default class ReviewItem extends React.Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired
  };

  state = {
    ...this.props.item
  };

  handleChangeRate = rate => {
    // 별점 수정
    this.setState({rate});
  };

  handleChange = (itemKey, e) => {
    // key 이름을 통해 바로 업데이트 할 수 있는 부분들
    this.setState({
      [itemKey]: e.target.value
    })
  };

  handleSubmit = e => {
    e.preventDefault();

    const { author, rate, content } = this.state;
    const postData = {
      author, rate, content
    };
    // 리뷰 수정
    fetch(`/api/review/${this.props.item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.get('token')}`
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(() => {
        toastr.success('Updated!');
      });
  };

  render() {
    const { item } = this.props;

    return (
      <div className="review">
        <form
          onSubmit={this.handleSubmit}
        >
          <span className="box">
            <input type="text"
              className="inherit-form-control"
              defaultValue={item.author}
              required
              onChange={this.handleChange.bind(this, 'author')}
            />
          </span>
          <span className="box">{moment(item.createdAt).format('lll')}</span>
          <RatingStar
            className="rating-star"
            currentRating={item.rate}
            max={5}
            onChange={this.handleChangeRate}
          />
          <Textarea
            className="inherit-form-control"
            defaultValue={item.content}
            placeholder="review"
            required
            onChange={this.handleChange.bind(this, 'content')}
          />
          <div className="text-right">
            <button type="submit" className="btn-submit btn btn-info">
              <i className="fa fa-pencil" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    );
  }
}
