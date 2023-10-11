import React from 'react'

const instaShareContext = React.createContext({
  isHomeButtonClicked: true,
  isSearchButtonClicked: false,
  isProfileButtonClicked: false,
  isHomeBtnClicked: () => {},
  isSearchBtnClicked: () => {},
  isProfileBtnClicked: () => {},
})

export default instaShareContext
