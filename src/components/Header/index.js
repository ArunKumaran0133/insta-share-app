import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'

import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'

import './index.css'

class Header extends Component {
  state = {isMenuOpen: false}

  openMenu = () => {
    this.setState({isMenuOpen: true})
  }

  closeMenu = () => {
    this.setState({isMenuOpen: false})
  }

  logoutHome = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  renderMenuItems = () => (
    <ul className="menu-items-list-container">
      <li>
        <Link to="/">
          <button type="button" className="nav-button">
            Home
          </button>
        </Link>
      </li>
      <li>
        <Link to="/search-results">
          <button type="button" className="nav-button">
            Search
          </button>
        </Link>
      </li>
      <li>
        <Link to="/my-profile">
          <button type="button" className="nav-button">
            Profile
          </button>
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="logout-button"
          onClick={this.logoutHome}
        >
          Logout
        </button>
      </li>
      <li>
        <button type="button" className="nav-button" onClick={this.closeMenu}>
          <AiFillCloseCircle fontSize={25} />
        </button>
      </li>
    </ul>
  )

  renderSmallDevice = () => {
    const {isMenuOpen} = this.state
    return (
      <>
        <div className="small-device-header">
          <div className="small-logo-container">
            <Link to="/" className="logo-container-header">
              <img
                src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597799/hzxukcatx98oofzd8zzj.png"
                alt="website logo"
                className="small-header-logo"
              />
              <h1 className="small-header-heading">Insta Share</h1>
            </Link>
          </div>
          <button
            type="button"
            className="header-menu-button"
            onClick={this.openMenu}
          >
            <GiHamburgerMenu />
          </button>
        </div>
        {isMenuOpen ? this.renderMenuItems() : null}
      </>
    )
  }

  renderLargeDevice = () => (
    <div className="header-container">
      <Link to="/" className="logo-container-header">
        <img
          src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597799/hzxukcatx98oofzd8zzj.png"
          alt="website logo"
          className="header-logo"
        />
        <h1 className="header-heading">Insta Share</h1>
      </Link>
      <ul className="nav-list-container">
        <Link to="/">
          <button type="button" className="nav-button">
            Home
          </button>
        </Link>
        <Link to="/search-results">
          <button type="button" className="nav-button">
            Search
          </button>
        </Link>
        <Link to="/my-profile">
          <button type="button" className="nav-button">
            Profile
          </button>
        </Link>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={this.logoutHome}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )

  render() {
    return (
      <>
        {this.renderSmallDevice()}
        {this.renderLargeDevice()}
      </>
    )
  }
}

export default withRouter(Header)
