import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdWarning} from 'react-icons/md'
import {FaSearch} from 'react-icons/fa'

import instaShareContext from '../../context/instaShareContext'
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
    getSearchInputHome: '',
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
        isPostLiked: true,
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
    const {postDetailsList} = this.state

    const getPostLikedPostDetail = postDetailsList.find(
      eachItem => eachItem.postId === postId,
    )
    const {isPostLiked} = getPostLikedPostDetail

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

    this.setState(prevState => ({
      postDetailsList: prevState.postDetailsList.map(eachItem => {
        if (eachItem.postId === postId) {
          if (eachItem.isPostLiked === false) {
            const updateLikeCount = eachItem.likesCount - 1
            const updateIsLikePost = !eachItem.isPostLiked
            return {
              ...eachItem,
              isPostLiked: updateIsLikePost,
              likesCount: updateLikeCount,
            }
          }
          const updateLikeCount = eachItem.likesCount + 1
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
  }

  successSearchResult = searchList => (
    <>
      <div className="heme-main-container">
        <h1 className="search-heading">Search Results</h1>
        <div className="search-result-container">
          <ul className="post-details-list-container">
            {searchList.map(eachItem => (
              <PostDetails key={eachItem.postId} postDetail={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    </>
  )

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
      <img
        src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696838588/b9yyjr0gxy4yrfkfljuc.png"
        alt="failure view"
        className="failure-image"
      />
      <div className="failure-icon-container">
        <MdWarning color="#4094EF" fontSize={45} />
      </div>
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
      <img
        src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696838588/b9yyjr0gxy4yrfkfljuc.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-message-post">
        Something went wrong. Please try again
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.reRenderStoriesApi}
      >
        Try Again
      </button>
    </div>
  )

  renderNoSearchResultView = () => (
    <div className="empty-view-container">
      <img
        src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696902640/f8izmsew1u7so8zevjo7.png"
        alt="no Result"
        className="no-search-result-image"
      />
      <h1 className="no-result-heading">Search Not Found</h1>
      <p className="no-result-para">Try different keyword or search again</p>
    </div>
  )

  resultSearchResult = searchList => {
    if (searchList.length === 0) {
      return this.renderNoSearchResultView()
    }
    return this.successSearchResult(searchList)
  }

  searchResult = (searchResultApiStatus, searchList) => {
    switch (searchResultApiStatus) {
      case apiStatusObj.inProgress:
        return this.renderPostLoadingView()
      case apiStatusObj.success:
        return this.resultSearchResult(searchList)
      default:
        return null
    }
  }

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
      <instaShareContext.Consumer>
        {value => {
          const {
            isSearchBtnClicked,
            searchList,
            searchResultApiStatus,
            isSearchButtonSmall,
            getSearchList,
            getSearchBtnClicked,
            loading,
            success,
            failure,
          } = value

          const {getSearchInputHome} = this.state

          const onGetSearchInput = event => {
            this.setState({getSearchInputHome: event.target.value})
          }

          const clickedHomeSearchBtn = async () => {
            getSearchBtnClicked()
            loading()
            const jwtToken = Cookies.get('jwt_token')
            const url = `https://apis.ccbp.in/insta-share/posts?search=${getSearchInputHome}`
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
              this.setState({getSearchInputHome: ''})
            } else {
              failure()
            }
          }

          return (
            <>
              <Header />
              {isSearchBtnClicked ? (
                <>
                  <>
                    {isSearchButtonSmall ? (
                      <>
                        <div className="search-input-container">
                          <input
                            type="search"
                            className="search-input"
                            onChange={onGetSearchInput}
                            placeholder="Search Caption"
                          />
                          <button
                            type="button"
                            data-testid="searchIcon"
                            className="search-button"
                            onClick={clickedHomeSearchBtn}
                          >
                            <FaSearch testid="searchIcon" />
                          </button>
                        </div>
                      </>
                    ) : null}
                  </>
                  {this.searchResult(
                    searchResultApiStatus,
                    searchList,
                    isSearchButtonSmall,
                  )}
                </>
              ) : (
                <div className="heme-main-container">
                  {isSearchButtonSmall ? (
                    <>
                      <div className="search-input-container">
                        <input
                          type="search"
                          className="search-input"
                          onChange={onGetSearchInput}
                          placeholder="Search Caption"
                        />
                        <button
                          type="button"
                          data-testid="searchIcon"
                          className="search-button"
                          onClick={clickedHomeSearchBtn}
                        >
                          <FaSearch />
                        </button>
                      </div>
                    </>
                  ) : null}
                  {this.renderStoriesResultView()}
                  {this.renderPostResultView()}
                </div>
              )}
            </>
          )
        }}
      </instaShareContext.Consumer>
    )
  }
}
export default Home
