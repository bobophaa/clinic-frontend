import { Navigate, Outlet } from 'react-router-dom'
import { getUser, getToken } from '../utils/auth'

function ProtectedRoute({ allowedRoles }) {
  const token = getToken()
  const user = getUser()

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Check role
  const userRole = user.role?.toLowerCase()

  if (
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute