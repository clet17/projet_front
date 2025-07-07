import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, userInfo } = useContext(AuthContext)

  if (!isAuthenticated || !userInfo?.is_admin) {
    return <Navigate to='/' />
  }

  return children
}

export default ProtectedAdminRoute
