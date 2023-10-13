import {Link} from 'react-router-dom'

import './index.css'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

const PostDetails = props => {
  const {postDetail, onLikePost} = props
  const {
    createdAt,
    postDetails,
    likesCount,
    profilePic,
    userName,
    comments,
    userId,
    postId,
    isPostLiked,
  } = postDetail

  const likeBtn = () => {
    onLikePost(postId, isPostLiked)
  }

  return (
    <li className="post-detail-container">
      <div className="user-pic-container">
        <img
          src={profilePic}
          alt="post author profile"
          className="profile-pic-post"
        />
        <Link to={`/users/${userId}`} className="link">
          <p className="user-name-post">{userName}</p>
        </Link>
      </div>

      <img src={postDetails.imageUrl} alt="post" className="post-image-url" />
      <div className="comments-container">
        <ul className="buttons-container-post">
          <li>
            {isPostLiked ? (
              <button
                type="button"
                className="post-button-items"
                data-testid="likeIcon"
                onClick={likeBtn}
              >
                <BsHeart testid="likeIcon" />
              </button>
            ) : (
              <button
                type="button"
                className="post-button-items"
                data-testid="unLikeIcon"
                onClick={likeBtn}
              >
                <BsHeart color="#F05161" testid="unLikeIcon" />
              </button>
            )}
          </li>
          <li>
            <button
              type="button"
              className="post-button-items"
              data-testid="commentIcon"
            >
              <FaRegComment />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="post-button-items"
              data-testid="shareIcon"
            >
              <BiShareAlt />
            </button>
          </li>
        </ul>
        <p className="post-like">{likesCount} Likes</p>
        <p className="post-caption">{postDetails.caption}</p>
        <ul className="comment-list-container">
          <li className="comment-container">
            <Link to={`/users/${userId}`} className="link comment">
              <span className="post-comment">{comments[0].userName} </span>
              <p className="span">{comments[0].comment}</p>
            </Link>
          </li>
          <li className="comment-container">
            <Link to={`/users/${userId}`} className="link comment">
              <span className="post-comment">{comments[1].userName}</span>
              <p className="span">{comments[1].comment}</p>
            </Link>
          </li>
        </ul>
        <p className="post-created-at">{createdAt}</p>
      </div>
    </li>
  )
}

export default PostDetails
