import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import instaShareContext from './context/instaShareContext'
import Login from './components/Login'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'

import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

import './App.css'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    isSearchBtnClicked: false,
    searchList: [],
    searchResultApiStatus: apiStatusObj.initial,
    isSearchButtonSmall: false,
  }

  getSearchBtnClicked = () => {
    this.setState({isSearchBtnClicked: true})
  }

  getSearchList = searchList => {
    this.setState({searchList})
  }

  success = () => {
    this.setState({searchResultApiStatus: apiStatusObj.success})
  }

  failure = () => {
    this.setState({searchResultApiStatus: apiStatusObj.failure})
  }

  loading = () => {
    this.setState({searchResultApiStatus: apiStatusObj.inProgress})
  }

  searchButtonSmall = () => {
    this.setState(prevState => ({
      isSearchButtonSmall: !prevState.isSearchButtonSmall,
    }))
  }

  render() {
    const {
      activeTab,
      isSearchBtnClicked,
      searchList,
      searchResultApiStatus,
      isSearchButtonSmall,
    } = this.state
    return (
      <instaShareContext.Provider
        value={{
          activeTab,
          getSearchList: this.getSearchList,
          isSearchBtnClicked,
          searchList,
          success: this.success,
          failure: this.failure,
          loading: this.loading,
          searchResultApiStatus,
          getSearchBtnClicked: this.getSearchBtnClicked,
          searchButtonSmall: this.searchButtonSmall,
          isSearchButtonSmall,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />

          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </instaShareContext.Provider>
    )
  }
}

export default App
