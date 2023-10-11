import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import instaShareContext from './context/instaShareContext'
import Login from './components/Login'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'
import SearchResults from './components/SearchResults'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

import './App.css'

class App extends Component {
  state = {
    isHomeButtonClicked: true,
    isSearchButtonClicked: false,
    isProfileButtonClicked: false,
  }

  isHomeBtnClicked = () => {
    this.setState({
      isHomeButtonClicked: true,
      isProfileButtonClicked: false,
      isSearchButtonClicked: false,
    })
  }

  isProfileBtnClicked = () => {
    this.setState({
      isHomeButtonClicked: false,
      isProfileButtonClicked: true,
      isSearchButtonClicked: false,
    })
  }

  isSearchBtnClicked = () => {
    this.setState({
      isHomeButtonClicked: false,
      isProfileButtonClicked: false,
      isSearchButtonClicked: true,
    })
  }

  render() {
    const {
      isHomeButtonClicked,
      isSearchButtonClicked,
      isProfileButtonClicked,
    } = this.state
    return (
      <instaShareContext.Provider
        value={{
          isHomeButtonClicked,
          isSearchButtonClicked,
          isProfileButtonClicked,
          isHomeBtnClicked: this.isHomeBtnClicked,
          isSearchBtnClicked: this.isSearchBtnClicked,
          isProfileBtnClicked: this.isProfileBtnClicked,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute
            exact
            path="/user-profile/:id"
            component={UserProfile}
          />
          <ProtectedRoute
            exact
            path="/search-results"
            component={SearchResults}
          />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </instaShareContext.Provider>
    )
  }
}

export default App
