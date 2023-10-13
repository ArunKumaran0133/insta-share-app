import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'

import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {FaSearch} from 'react-icons/fa'

import instaShareContext from '../../context/instaShareContext'
import './index.css'

class Header extends Component {
  state = {isMenuOpen: false, searchInput: ''}

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
    <instaShareContext.Consumer>
      {value => {
        const {searchButtonSmall} = value

        const isSearch = () => {
          searchButtonSmall()
          const {history} = this.props
          history.replace('/')
        }

        return (
          <ul className="menu-items-list-container">
            <li>
              <Link to="/">
                <button type="button" className="nav-button">
                  Home
                </button>
              </Link>
            </li>
            <li>
              <button type="button" className="nav-button" onClick={isSearch}>
                Search
              </button>
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
              <button
                type="button"
                className="nav-button"
                onClick={this.closeMenu}
              >
                <AiFillCloseCircle fontSize={25} />
              </button>
            </li>
          </ul>
        )
      }}
    </instaShareContext.Consumer>
  )

  renderSmallDevice = () => {
    const {isMenuOpen} = this.state
    return (
      <>
        <ul className="small-device-header">
          <li className="small-logo-container">
            <Link to="/" className="logo-container-header">
              <img
                src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696597799/hzxukcatx98oofzd8zzj.png"
                alt="website logo"
                className="small-header-logo"
              />
              <h1 className="small-header-heading">Insta Share</h1>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="header-menu-button"
              onClick={this.openMenu}
            >
              <GiHamburgerMenu />
            </button>
          </li>
        </ul>
        {isMenuOpen ? this.renderMenuItems() : null}
      </>
    )
  }

  renderLargeDevice = () => (
    <instaShareContext.Consumer>
      {value => {
        const {searchInput} = this.state
        const {
          activeTab,
          getSearchList,
          success,
          failure,
          loading,
          getSearchBtnClicked,
        } = value

        const classSearchName =
          activeTab === 'Search' ? `nav-button active-class` : 'nav-button'

        const classProfileName =
          activeTab === 'Profile' ? `nav-button active-class` : 'nav-button'

        const getSearchInputHeader = event => {
          this.setState({searchInput: event.target.value})
        }

        const clickedSearchBtn = async () => {
          getSearchBtnClicked()
          loading()
          const jwtToken = Cookies.get('jwt_token')
          const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
          const options = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }

          const response = await fetch(url, options)

          if (response.ok) {
            const data = await response.json()
            const formattedData = data.posts.map(eachItem => ({
              createdAt: eachItem.created_at,
              likesCount: eachItem.likes_count,
              postDetails: {
                caption: eachItem.post_details.caption,
                imageUrl: eachItem.post_details.image_url,
              },
              postId: eachItem.post_id,
              profilePic: eachItem.profile_pic,
              userId: eachItem.user_id,
              userName: eachItem.user_name,
              comments: [
                {
                  comment: eachItem.comments[0].comment,
                  userId: eachItem.comments[0].user_id,
                  userName: eachItem.comments[0].user_name,
                },
                {
                  comment: eachItem.comments[1].comment,
                  userId: eachItem.comments[1].user_id,
                  userName: eachItem.comments[1].user_name,
                },
              ],
              isPostLiked: false,
            }))
            success()
            getSearchList(formattedData)
            this.setState({searchInput: ''})
          } else {
            failure()
          }
        }

        return (
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
              <li className="header-input-container">
                <input
                  type="search"
                  className="header-input"
                  placeholder="Search Caption"
                  onChange={getSearchInputHeader}
                  value={searchInput}
                />
                <button
                  type="button"
                  className="header-icon-container"
                  onClick={clickedSearchBtn}
                  data-testid="searchIcon"
                >
                  <FaSearch />
                </button>
              </li>
              <li>
                <Link to="/">
                  <button type="button" className={classSearchName}>
                    Home
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/my-profile">
                  <button type="button" className={classProfileName}>
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
            </ul>
          </div>
        )
      }}
    </instaShareContext.Consumer>
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
