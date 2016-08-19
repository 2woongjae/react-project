import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'toastr/build/toastr.css';
import 'sweetalert/dist/sweetalert.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-anything-sortable/sortable.css';
import '../static/styles/simplify.css';
import '../static/styles/text.css';
import '../static/styles/header.css';
import '../static/styles/sidebar.css';
import '../static/styles/parts.css';
import '../static/styles/button.css';
import '../static/styles/sign-in.css';
import '../static/styles/item-container.css';
import '../static/styles/contents-item.css';
import '../static/styles/video-detail.css';

export default class AppContainer extends React.Component {
  render() {
    return (
      <div className="wrapper">
        {this.props.children}
      </div>
    );
  }
}
