import { Navigate } from 'react-router-dom'

const Protected = ({ getUser, children }) => {
  if (!getUser) return <Navigate to="/admin/login" replace />
  return children
}

const SignedIn = ({ getUser, children }) => {
  if (getUser) return <Navigate to="/admin" replace />
  return children
}

export { Protected, SignedIn }