import React from 'react';
import classNames from 'classnames';
import toastr from 'toastr';
import Uploader from '../../../utils/uploader';

export default class FileUploader extends React.Component {
  static propTypes = {
    container: React.PropTypes.string.isRequired,
    accept: React.PropTypes.string,
    acceptedFiles: React.PropTypes.array,
    required: React.PropTypes.bool,
    onComplete: React.PropTypes.func.isRequired
  };

  state = {
    progress: 0
  };

  handleChange = (e) => {
    const fileEl = e.target;
    const file = fileEl.files[0];
    const ext = file.name.split('.').pop();
    const { acceptedFiles, container, onComplete } = this.props;
    if (
      acceptedFiles && !acceptedFiles.includes(`.${ext.toLowerCase()}`)
    ) {
      toastr.error(
      `허용되는 확장자가 아닙니다. 허용되는 확장자: ${acceptedFiles.join(', ')}`);
      // input 초기화
      $(fileEl).val('');
      return;
    }

    this.setState({progress: 0});
    const upload = new Uploader(file, container);
    upload.onProgress(progress => {
      this.setState({progress});
    });
    upload.onComplete(uploadedUrl => {
      onComplete(uploadedUrl);
      // input 초기화
      $(fileEl).val('');
    });
  };

  render() {
    const { progress } = this.state;
    const progressClass = {on: progress, completed: progress === 100};

    return (
      <label className={classNames('file-upload', progressClass)}>
        {this.props.children}

        <div className={classNames('progress', progressClass)}>
          <div className="progress-bar progress-bar-success progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{width: `${progress}%`}}
          >
            {progress}%
          </div>
        </div>

        <input type="file"
          accept={this.props.accept}
          required={this.props.required}
          onChange={this.handleChange}
        />
      </label>
    )
  }
};
