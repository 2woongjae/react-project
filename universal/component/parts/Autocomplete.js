import React from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';

const ListItem = (textField, { item }) => {
  return (
    <span>
      {item.image &&
        <span className="item-image">
          <img src={item.image} width="30" style={{lineHeight: '30px'}} alt="" />
        </span>
      }
      {item[textField]}
    </span>
  )
};

export default class Autocomplete extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,  // api 타입 (vods, live-tv, ...)
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    items: React.PropTypes.array,
    textField: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  };

  state = {
    isFetching: false,
    data: []
  };

  fetchPromise = null;

  componentWillUnmount() {
    if (this.fetchPromise) this.fetchPromise.cancel();
  }

  handleGetOptions = (input) => {
    if (input.length < 1) return;

    // 데이터 리스트 불러오기
    const { type, items } = this.props;
    this.setState({isFetching: true});

    this.fetchPromise = fetch(`/api/${type}?q=${input}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          isFetching: false,
          data: res.data.filter(item =>
            !(items || []).map(n => n._id).includes(item._id)
          )  // 이미 추가된 데이터 제거
        });
      });
  };

  handleChange = (item) => {
    const { items, onChange } = this.props;
    // 선택된 상태에서 재선택 시 추가 안되도록 예외 처리
    if ((items || []).map(n => n._id).includes(item._id)) return;
    onChange(item);
  };

  render() {
    const { label, placeholder, disabled, textField = 'title' } = this.props;
    const { isFetching, data } = this.state;

    return (
      <div className="api-autocomplete">
        {label &&
          <label htmlFor="add-video-item">{label}</label>
        }
        <div className="input-area">
          <DropdownList
            id="add-video-item"
            placeholder={placeholder}
            disabled={disabled}
            textField={textField}
            itemComponent={ListItem.bind(this, textField)}
            busy={isFetching}
            data={data}
            filter={ () => true }
            onSearch={this.handleGetOptions}
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}
