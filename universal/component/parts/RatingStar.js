import React from 'react';
import classNames from 'classnames';

const Icon = ({
  className, onMouseEnter, onClickRating
}) => {
  return (
    <i className={classNames('fa', className)} onMouseMove={onMouseEnter} onClick={onClickRating}/>
  );
};

export default class RatingStar extends React.Component {
  static propTypes = {
    currentRating: React.PropTypes.number,
    viewOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func
  };

  state = {
    currentRating: this.props.currentRating || 0,
    max: this.props.max || 5,
    currentRatingHover: 0,
    hovering: false
  };

  onMouseEnter = (currentRating, e) => {
    let rating = currentRating;
    const mouseAt = Math.round(
      Math.abs(e.clientX - e.target.getBoundingClientRect().left));

    if (mouseAt < e.target.offsetWidth / 2)
      rating -= .5;
    this.setState({
      currentRatingHover: rating,
      hovering : true
    });
  };

  onMouseLeave = () => {
    this.setState({
      hovering: false
    });
  };

  onClickRating = () => {
    this.setState({
      currentRating: this.state.currentRatingHover
    });
    if (this.props.onChange)
      this.props.onChange(this.state.currentRatingHover);
  };

  render() {
    const { viewOnly } = this.props;
    const f = () => {};
    const onMouseEnter = viewOnly ? f : this.onMouseEnter;
    const onClickRating = viewOnly ? f : this.onClickRating;

    return (
      <div className={this.props.className}
        onMouseLeave={this.onMouseLeave}
      >
        {Array.from(new Array(this.state.max)).map((v, i) => {
          const index = i+1;
          const rating = this.state[`currentRating${this.state.hovering ? 'Hover' : ''}`];
          const rateInt = parseInt(rating, 10);
          let className = 'fa-star-o';
          if (rateInt >= index)
            className = 'fa-star';
          if (Math.ceil(rating) === index &&
            (rating % rateInt || rating === 0.5))
            className = 'fa-star-half-o';

          return (
            <Icon
              key={index}
              className={className}
              onMouseEnter={onMouseEnter.bind(this, index)}
              onClickRating={onClickRating}
            />
          );
        })}
      </div>
    );
  }
}
