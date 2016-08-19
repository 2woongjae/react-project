import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import 'bootstrap';
import FileUploader from '../../parts/FileUploader';

export default class AddPhoto extends React.Component {
  static propTypes = {
    onAdded: React.PropTypes.func.isRequired
  };

  initialState = {
    thumb: null,
    image: null
  };

  state = this.initialState;

  componentWillMount() {
    this.setState(this.initialState);
  }

  componentWillUnmount() {
    $('#add-photo-modal').off();
  }

  onCompleteImageUpload = (key, url) => {
    this.setState({[key]: url}, () => {
      const { thumb, image } = this.state;
      if (thumb && image) {
        this.props.onAdded(this.state);
      }
    });
  };

  render() {
    const { thumb, image } = this.state;

    return (
      <div id={this.props.id} className="add-photo-modal modal fade" tabIndex={-1} role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              <h4 className="modal-title">사진 추가하기</h4>
            </div>
            <div className="modal-body">
              <div className="clearfix">
                <div className="thumb"
                  style={{backgroundImage: `url(${thumb || ''})`}}
                ></div>
                <FileUploader
                  container="/photos/thumb"
                  accept="image/*"
                  acceptedFiles={['.jpg', '.jpeg', '.png']}
                  onComplete={this.onCompleteImageUpload.bind(this, 'thumb')}
                >
                  <span className="form-label">
                    썸네일
                  </span>
                </FileUploader>
              </div>
              <div className="clearfix">
                <div className="thumb"
                  style={{backgroundImage: `url(${image || ''})`}}
                ></div>
                <FileUploader
                  container="/photos/image"
                  accept="image/*"
                  acceptedFiles={['.jpg', '.jpeg', '.png']}
                  onComplete={this.onCompleteImageUpload.bind(this, 'image')}
                >
                  <span className="form-label">
                    원본 이미지
                  </span>
                </FileUploader>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
