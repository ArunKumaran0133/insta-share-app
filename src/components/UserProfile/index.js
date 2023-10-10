import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    userProfileData: [],
    storiesList: [],
    postsList: [],
    apiStatus: apiStatusObj.initial,
  }

  componentDidMount() {
    this.getUserDetails()
  }

  getUserDetails = async () => {
    this.setState({apiStatus: apiStatusObj.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const formattedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        profilePic: data.user_details.profile_pic,
        postsCount: data.user_details.posts_count,
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
      }
      const formatStoriesList = data.user_details.stories.map(eachStories => ({
        id: eachStories.id,
        image: eachStories.image,
      }))

      const formatPostList = data.user_details.posts.map(eachPost => ({
        id: eachPost.id,
        image: eachPost.image,
      }))

      this.setState({
        userProfileData: formattedData,
        storiesList: formatStoriesList,
        postsList: formatPostList,
        apiStatus: apiStatusObj.success,
      })
    } else {
      this.setState({apiStatus: apiStatusObj.failure})
    }
  }

  reRenderApi = () => {
    this.getMyDetails()
  }

  renderSuccessView = () => {
    const {userProfileData, storiesList} = this.state
    const {
      profilePic,
      userName,
      followersCount,
      postsCount,
      followingCount,
      userId,
      userBio,
    } = userProfileData
    return (
      <div className="user-profile-container">
        <div className="small-device-user-details-container">
          <h1 className="username-small-device">{userName}</h1>
          <div className="user-detail-container-small">
            <img
              src={profilePic}
              alt={userName}
              className="small-device-user-pic"
            />
            <div className="user-description-container-profile">
              <p className="posts-count-text">
                {postsCount} <br />
                <span className="span">Posts</span>
              </p>
              <p className="posts-count-text">
                {followersCount} <br /> <span className="span">Followers</span>
              </p>
              <p className="posts-count-text">
                {followingCount} <br /> <span className="span">Following</span>
              </p>
            </div>
          </div>
          <div>
            <h1 className="profile-user-id">{userId}</h1>
            <p className="profile-user-bio">{userBio}</p>
          </div>
        </div>
        <div className="user-details-container">
          <img src={profilePic} alt={userName} className="user-profile-pic" />
          <div>
            <h1 className="user-name-user-profile">{userName}</h1>
            <div className="user-description-container-profile">
              <p className="posts-count-text">
                {postsCount} <span className="span">Posts</span>
              </p>
              <p className="posts-count-text">
                {followersCount} <span className="span">Followers</span>
              </p>
              <p className="posts-count-text">
                {followingCount} <span className="span">Following</span>
              </p>
            </div>
            <h1 className="profile-user-id">{userId}</h1>
            <p className="profile-user-bio">{userBio}</p>
          </div>
        </div>
        <ul className="stories-list-profile">
          {storiesList.map(eachStories => (
            <li key={eachStories.id}>
              <img
                src={eachStories.image}
                alt={eachStories.id}
                className="profile-stories-image"
              />
            </li>
          ))}
        </ul>
        <div>
          <div className="post-icon-container">
            <BsGrid3X3 fontSize={22} />
            <p className="posts-text">Posts</p>
          </div>
        </div>
        {this.renderPostDetailView()}
      </div>
    )
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loader">
      <Loader color="#4094EF" type="TailSpin" />
    </div>
  )

  renderNoPostView = () => (
    <div className="no-post-view-container">
      <div className="camera-container">
        <BiCamera />
      </div>
      <p className="no-post-text">No Posts Yet</p>
    </div>
  )

  renderPostView = () => {
    const {postsList} = this.state
    return (
      <ul className="post-list-container">
        {postsList.map(eachPost => (
          <li key={eachPost.id}>
            <img
              src={eachPost.image}
              alt={eachPost.id}
              className="post-image"
            />
          </li>
        ))}
      </ul>
    )
  }

  renderPostDetailView = () => {
    const {postsList} = this.state
    if (postsList.length === 0) {
      return this.renderNoPostView()
    }
    return this.renderPostView()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696838588/b9yyjr0gxy4yrfkfljuc.png"
        alt="failure"
        className="failure-image"
      />
      <p className="failure-message">Something went wrong. Please try again</p>
      <button
        type="button"
        className="failure-button"
        onClick={this.reRenderApi}
      >
        Try Again
      </button>
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusObj.inProgress:
        return this.renderInProgressView()
      case apiStatusObj.success:
        return this.renderSuccessView()
      case apiStatusObj.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderResultView()}
      </>
    )
  }
}

export default UserProfile
