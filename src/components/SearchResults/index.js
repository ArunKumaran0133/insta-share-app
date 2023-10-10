import {Component} from 'react'
import Cookies from 'js-cookie'
import {GoSearch} from 'react-icons/go'
import Loader from 'react-loader-spinner'

import PostDetails from '../PostDetails'
import Header from '../Header'

import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class SearchResults extends Component {
  state = {
    userSearchInput: '',
    postDetailsList: [],
    apiStatus: apiStatusObj.initial,
  }

  onGetSearchInput = event => {
    this.setState({
      userSearchInput: event.target.value,
    })
  }

  getSearchResults = async () => {
    const {userSearchInput} = this.state

    if (userSearchInput.length > 0) {
      this.setState({apiStatus: apiStatusObj.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const url = `https://apis.ccbp.in/insta-share/posts?search=${userSearchInput}`
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
        }))
        this.setState({
          postDetailsList: formattedData,
          apiStatus: apiStatusObj.success,
        })
      }
    }
  }

  renderSuccessView = () => {
    const {postDetailsList} = this.state
    return (
      <ul className="post-details-list-container">
        {postDetailsList.map(eachItem => (
          <PostDetails key={eachItem.postId} postDetail={eachItem} />
        ))}
      </ul>
    )
  }

  renderEmptyPostView = () => (
    <div className="empty-view-container">
      <GoSearch fontSize={40} color="#989898" />
      <p className="empty-search-text">Search Results will be appear here</p>
    </div>
  )

  renderInProgressView = () => (
    <div data-testid="loader" className="loader">
      <Loader color="#4094EF" type="TailSpin" />
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

  renderPostResultView = () => {
    const {postDetailsList} = this.state
    if (postDetailsList.length === 0) {
      return this.renderNoSearchResultView()
    }
    return this.renderSuccessView()
  }

  renderResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusObj.initial:
        return this.renderEmptyPostView()
      case apiStatusObj.inProgress:
        return this.renderInProgressView()
      case apiStatusObj.success:
        return this.renderPostResultView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="search-container">
          <div className="search-input-container">
            <input
              type="search"
              className="search-input"
              onChange={this.onGetSearchInput}
              placeholder="Search Caption"
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.getSearchResults}
            >
              <GoSearch />
            </button>
          </div>
          {this.renderResultView()}
        </div>
      </>
    )
  }
}

export default SearchResults
