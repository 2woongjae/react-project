import React from 'react';
import store from 'store';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import LoginForm from '../common/LoginForm';

export default class BasicLayout extends React.Component {
  state = {
    isLoggedIn: !!store.get('token')
  };

  handleLogin = () => {
    this.setState({isLoggedIn: true});
  };

  handleLogout = e => {
    e.preventDefault();
    store.remove('token');
    store.remove('user');
    this.setState({isLoggedIn: false});
  };

  render() {
    if (!this.state.isLoggedIn) return (
      <LoginForm
        onLogin={this.handleLogin}
      />
    );

    return (
      <div className="basic-layout">
        <Header
          onLogout={this.handleLogout}
        />
        <Sidebar />

        <div className="main-container">
          <div className="padding-md">
            {React.cloneElement(this.props.children)}
          </div>
        </div>
      </div>
    );
  }
}
