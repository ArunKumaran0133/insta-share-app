import React from 'react'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const instaShareContext = React.createContext({
  activeTab: 'Home',
  isHomeBtnClicked: () => {},
  isProfileBtnClicked: () => {},
  getSearchList: () => {},
  searchList: [],
  isSearchBtnClicked: false,
  searchResultApiStatus: apiStatusObj.initial,
  success: () => {},
  failure: () => {},
  loading: () => {},
  getSearchBtnClicked: () => {},
  searchButtonSmall: () => {},
  isSearchButtonSmall: false,
})

export default instaShareContext
