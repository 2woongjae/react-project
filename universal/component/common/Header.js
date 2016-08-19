import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import store from 'store';

export default class Header extends React.Component {
  static propTypes = {
    onLogout: React.PropTypes.func.isRequired
  };

  state = {
    isUserToggleOn: false
  };

  get user() {
    return store.get('user');
  }

  handleClickUserToggle = () => {
    this.setState({isUserToggleOn: !this.state.isUserToggleOn});
  };

  render() {
    const { isUserToggleOn } = this.state;

    return (
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="nav-header">
            <Link to="/" className="brand">
              <i className="fa fa-database" /><span className="brand-name">VTV ADMIN</span>
            </Link>
          </div>
          <div className="nav-container">
            <ul className="nav-notification">
              <li className="search-list">
                <div className="search-input-wrapper">
                  <div className="search-input">
                    <input type="text" className="form-control input-sm inline-block" />
                    <a href="#" className="input-icon text-normal"><i className="fa fa-search" /></a>
                  </div>
                </div>
              </li>
            </ul>
            <div className="pull-right">
              <div className={classNames('user-block hidden-xs', {open: isUserToggleOn})}>
                <button type="button" className="btn btn-none"
                  onClick={this.handleClickUserToggle}
                >
                  <img src="http://static.srcdn.com/slir/w1000-h500-q90-c1000:500/wp-content/uploads/Spider-Man-Civil-War-Team-Cap.jpg" className="img-circle inline-block user-profile-pic" alt="" />
                  <div className="user-detail inline-block">
                    {this.user.email_address}
                    <i className="fa fa-angle-down" />
                  </div>
                </button>
                <div className="panel border dropdown-menu user-panel">
                  <div className="panel-body paddingTB-sm">
                    <ul>
                      <li>
                        <a href="profile.html">
                          <i className="fa fa-edit fa-lg" /><span className="m-left-xs">My Profile</span>
                        </a>
                      </li>
                      <li>
                        <a href="#"
                          onClick={this.props.onLogout}
                        >
                          <i className="fa fa-power-off fa-lg" /><span className="m-left-xs">Sign out</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
