import React from 'react';
import store from 'store';
import toastr from 'toastr';

export default class LoginForm extends React.Component {
  static propTypes = {
    onLogin: React.PropTypes.func.isRequired
  };

  state = {
    email_address: '',
    password: ''
  };

  handleLogin = e => {
    e.preventDefault();
    fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(res => {
        if (res.meta.error)
          throw new Error(res.meta.message);

        // 로그인 성공 시 sessionStorage에 토큰이랑 유저 정보 저장
        store.set('token', res.data.token);
        store.set('user', res.data.user);
        this.props.onLogin();
        return Promise.resolve();
      })
      .catch(error => toastr.error(error));
  };

  handleChangeEmail = e => {
    this.setState({email_address: e.target.value});
  };

  handleChangePassword = e => {
    this.setState({password: e.target.value});
  };

  render() {
    return (
      <form className="form-signin" onSubmit={this.handleLogin}>
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus
          onChange={this.handleChangeEmail}
        />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" name="passwd" id="inputPassword" className="form-control" placeholder="Password" required
          onChange={this.handleChangePassword}
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
    )
  }
}
