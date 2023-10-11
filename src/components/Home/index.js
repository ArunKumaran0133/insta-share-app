import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdWarning} from 'react-icons/md'

import Header from '../Header'
import StorySlider from '../StorySlider'
import PostDetails from '../PostDetails'

import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    storyList: [],
    postDetailsList: [],
    apiPostStatus: apiStatusObj.initial,
    apiStoriesStatus: apiStatusObj.initial,
  }

  componentDidMount() {
    this.getStoryDetails()
    this.getPostsDetails()
  }

  getStoryDetails = async () => {
    this.setState({apiStoriesStatus: apiStatusObj.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.users_stories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      this.setState({
        storyList: formattedData,
        apiStoriesStatus: apiStatusObj.success,
      })
    } else {
      this.setState({apiStoriesStatus: apiStatusObj.failure})
    }
  }

  getPostsDetails = async () => {
    this.setState({apiPostStatus: apiStatusObj.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/posts'
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

      this.setState({
        postDetailsList: formattedData,
        apiPostStatus: apiStatusObj.success,
      })
    } else {
      this.setState({apiPostStatus: apiStatusObj.failure})
    }
  }

  onLikePost = async postId => {
    this.setState(prevState => ({
      postDetailsList: prevState.postDetailsList.map(eachItem => {
        if (eachItem.postId === postId) {
          if (eachItem.isPostLiked === false) {
            const updateLikeCount = eachItem.likesCount + 1
            const updateIsLikePost = !eachItem.isPostLiked
            return {
              ...eachItem,
              isPostLiked: updateIsLikePost,
              likesCount: updateLikeCount,
            }
          }
          const updateLikeCount = eachItem.likesCount - 1
          const updateIsLikePost = !eachItem.isPostLiked
          return {
            ...eachItem,
            isPostLiked: updateIsLikePost,
            likesCount: updateLikeCount,
          }
        }
        return eachItem
      }),
    }))

    const {postDetailsList} = this.state
    const {isPostLiked} = postDetailsList

    const jwtToken = Cookies.get('jwt_token')
    const likeStatus = {like_status: isPostLiked}
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(likeStatus),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
  }

  reRenderStoriesApi = () => {
    this.getStoryDetails()
  }

  reRenderPostsApi = () => {
    this.getPostsDetails()
  }

  renderStorySuccessView = () => {
    const {storyList} = this.state
    return (
      <div className="story-slider-container">
        <StorySlider storyList={storyList} />
      </div>
    )
  }

  renderPostSuccessView = () => {
    const {postDetailsList} = this.state
    return (
      <ul className="post-details-list-container">
        {postDetailsList.map(eachItem => (
          <PostDetails
            key={eachItem.postId}
            postDetail={eachItem}
            onLikePost={this.onLikePost}
          />
        ))}
      </ul>
    )
  }

  renderStoryLoadingView = () => (
    <div className="loader-stories" data-testid="loader">
      <Loader color="#4094EF" type="TailSpin" />
    </div>
  )

  renderPostLoadingView = () => (
    <div className="loader-post" data-testid="loader">
      <Loader color="#4094EF" type="TailSpin" />
    </div>
  )

  renderPostFailureView = () => (
    <div className="failure-view-container">
      <MdWarning color="#4094EF" fontSize={45} />
      <p className="failure-message-post">
        Something went wrong. Please try again
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.reRenderPostsApi}
      >
        Try Again
      </button>
    </div>
  )

  renderFailureViewStories = () => (
    <div className="loader-stories">
      <button
        className="failure-button"
        type="button"
        onClick={this.reRenderStoriesApi}
      >
        Try Again
      </button>
    </div>
  )

  renderPostResultView = () => {
    const {apiPostStatus} = this.state
    switch (apiPostStatus) {
      case apiStatusObj.inProgress:
        return this.renderPostLoadingView()
      case apiStatusObj.success:
        return this.renderPostSuccessView()
      case apiStatusObj.failure:
        return this.renderPostFailureView()
      default:
        return null
    }
  }

  renderStoriesResultView = () => {
    const {apiStoriesStatus} = this.state
    switch (apiStoriesStatus) {
      case apiStatusObj.inProgress:
        return this.renderStoryLoadingView()
      case apiStatusObj.success:
        return this.renderStorySuccessView()
      case apiStatusObj.failure:
        return this.renderFailureViewStories()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="heme-main-container">
          {this.renderStoriesResultView()}
          {this.renderPostResultView()}
        </div>
      </>
    )
  }
}

export default Home
