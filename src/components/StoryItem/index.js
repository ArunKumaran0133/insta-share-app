import './index.css'

const StoryItem = props => {
  const {storyDetail} = props
  const {userName, storyUrl} = storyDetail
  return (
    <div className="story-container">
      <img src={storyUrl} alt="user story" className="story-image" />
      <h1 className="user-name">{userName}</h1>
    </div>
  )
}

export default StoryItem
