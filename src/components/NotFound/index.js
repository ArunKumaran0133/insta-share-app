import './index.css'

const NotFound = props => {
  const replaceHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dg3h5bne2/image/upload/v1696926643/lfyg9zjnzxrvvter71f5.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="page-not-found-para">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <button type="button" className="not-found-button" onClick={replaceHome}>
        Home Page
      </button>
    </div>
  )
}

export default NotFound
