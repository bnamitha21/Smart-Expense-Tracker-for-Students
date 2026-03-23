const TOKEN_KEY = 'token'
const EMAIL_KEY = 'user_email'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
}

export const setUserEmail = (email) => localStorage.setItem(EMAIL_KEY, email)

export const getUserEmail = () => localStorage.getItem(EMAIL_KEY)

export const isAuthenticated = () => !!getToken()
