import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isLoginSuccess: true}

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({errorMsg, isLoginSuccess: false, username: '', password: ''})
  }

  getUserDetail = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.setState({isLoginSuccess: true})
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  getUserInput = event => {
    this.setState({username: event.target.value})
  }

  getUserPassword = event => {
    this.setState({password: event.target.value})
  }

  renderLargeView = () => {
    const {isLoginSuccess, errorMsg, username, password} = this.state
    return (
      <div className="login-main-container">
        <img
          src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597949/q4m2lns9gyovbhhtsmmg.png"
          alt="login"
          className="login-image"
        />
        <form className="form-container" onSubmit={this.getUserDetail}>
          <img
            src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597799/hzxukcatx98oofzd8zzj.png"
            alt="website logo"
            className="login-logo"
          />
          <h1 className="login-heading">Insta Share</h1>
          <div className="input">
            <label htmlFor="userNameInput" className="login-label">
              Username
            </label>
            <input
              type="text"
              className="login-input"
              id="userNameInput"
              placeholder="User Name"
              onChange={this.getUserInput}
              value={username}
            />
          </div>
          <div className="input">
            <label htmlFor="passwordInput" className="login-label">
              Password
            </label>
            <input
              type="password"
              className="login-input"
              id="passwordInput"
              placeholder="Password"
              onChange={this.getUserPassword}
              value={password}
            />
          </div>
          {isLoginSuccess ? null : <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }

  renderSmallView = () => {
    const {username, password, isLoginSuccess, errorMsg} = this.state
    return (
      <form className="small-login-container" onSubmit={this.getUserDetail}>
        <div className="small-login-cart">
          <img
            src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597799/hzxukcatx98oofzd8zzj.png"
            alt="website logo"
            className="small-logo"
          />
          <h1 className="login-heading-small">Insta Share</h1>
          <div className="login-input-container">
            <label className="small-input-label" htmlFor="smallUsernameInput">
              Username
            </label>
            <input
              className="small-login-input"
              type="text"
              id="smallUsernameInput"
              onChange={this.getUserInput}
              value={username}
              placeholder="User Name"
            />
          </div>
          <div className="login-input-container">
            <label className="small-input-label" htmlFor="smallPasswordInput">
              Password
            </label>
            <input
              className="small-login-input"
              type="password"
              id="smallPasswordInput"
              onChange={this.getUserPassword}
              value={password}
              placeholder="Password"
            />
          </div>
          {isLoginSuccess ? null : <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="small-login-button">
            Login
          </button>
        </div>
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        {this.renderSmallView()}
        {this.renderLargeView()}
      </>
    )
  }
}

export default Login
