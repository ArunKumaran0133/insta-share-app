import {Link} from 'react-router-dom'

import './index.css'

const StoryItem = props => {
  const {storyDetail} = props
  const {userName, storyUrl, userId} = storyDetail
  return (
    <li className="story-container">
      <img src={storyUrl} alt="user story" className="story-image" />
      <Link to={`/users/${userId}`} className="link">
        <h1 className="user-name">{userName}</h1>
      </Link>
    </li>
  )
}

export default StoryItem
