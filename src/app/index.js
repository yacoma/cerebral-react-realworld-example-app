import { Module } from 'cerebral'
import HttpProvider from '@cerebral/http'
import storage from '@cerebral/storage'

import { apiUrl } from '../constants'
import blog from './modules/blog'
import profile from './modules/profile'
import auth from './modules/auth'
import router from './router'
import { AuthenticationError } from './errors'
import * as sequences from './sequences'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

export default Module({
  state: {
    currentPage: '',
    lastVisited: '',
    errorMessages: [],
    pageIsLoading: false,
    hasAuthenticated: false,
  },
  signals: {
    homeRouted: sequences.routeToHome,
    pageRouted: sequences.routeToPage,
    articleRouted: sequences.routeToArticle,
    editorRouted: sequences.routeToEditor,
    profileRouted: sequences.routeToProfile,
    fieldChanged: sequences.changeField,
  },
  modules: {
    blog,
    profile,
    auth,
    router,
    storage: storage({ target: localStorage }),
  },
  providers: {
    http: HttpProvider({
      baseUrl: apiUrl,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: jwtHeader ? 'Token ' + jwtHeader : '',
      },
    }),
  },
  catch: [[AuthenticationError, sequences.redirectToLogin]],
})
