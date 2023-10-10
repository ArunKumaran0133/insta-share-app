import {Link} from 'react-router-dom'

import './index.css'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {AiFillHeart} from 'react-icons/ai'

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

  console.log(isPostLiked)

  const icon = isPostLiked ? <AiFillHeart color="#F05161" /> : <BsHeart />

  const likeBtn = () => {
    onLikePost(postId, isPostLiked)
  }

  return (
    <li className="post-detail-container">
      <div className="user-pic-container">
        <img src={profilePic} alt={userName} className="profile-pic-post" />
        <Link to={`/user-profile/${userId}`} className="link">
          <h1 className="user-name-post">{userName}</h1>
        </Link>
      </div>

      <img
        src={postDetails.imageUrl}
        alt={postDetails.caption}
        className="post-image-url"
      />
      <div className="comments-container">
        <div className="buttons-container-post">
          <button
            type="button"
            className="post-button-items"
            data-testid="like-button"
            onClick={likeBtn}
          >
            {icon}
          </button>
          <button
            type="button"
            className="post-button-items"
            data-testid="comment-button"
          >
            <FaRegComment />
          </button>
          <button
            type="button"
            className="post-button-items"
            data-testid="share-button"
          >
            <BiShareAlt />
          </button>
        </div>
        <p className="post-like">{likesCount} Likes</p>
        <p className="post-caption">{postDetails.caption}</p>
        <p className="post-comment">
          {comments[0].userName}{' '}
          <span className="span">{comments[0].comment}</span>
        </p>
        <p className="post-comment">
          {comments[1].userName}{' '}
          <span className="span">{comments[1].comment}</span>
        </p>
        <p className="post-created-at">{createdAt}</p>
      </div>
    </li>
  )
}

export default PostDetails
