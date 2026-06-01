export const getToken = () => {
  return localStorage.getItem('auth_token')
}

export const getUser = () => {
  const user = localStorage.getItem('auth_user')

  return user ? JSON.parse(user) : null
}

export const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')

  window.location.href = '/login'
}