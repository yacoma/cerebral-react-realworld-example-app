import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'
import removeUser from './removeUser'

test('should remove current user state', () => {
  localStorage.setItem('jwtHeader', JSON.stringify(validJWT))

  return runAction(removeUser, {
    state: {
      auth: {
        authenticated: true,
        currentUser: {
          email: 'test@example.com',
          username: 'Tester',
        },
      },
    },
    modules: { storage: StorageModule({ target: localStorage }) },
    providers: {
      http: HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
          Authorization: 'Token ' + validJWT,
        },
      }),
    },
  }).then(({ state }) => [
    expect(state.auth.authenticated).toBe(false),
    expect(state.auth.currentUser.email).toBe(''),
    expect(state.auth.currentUser.username).toBe(''),
    expect(localStorage.getItem('jwtHeader')).toBe(null),
  ])
})
