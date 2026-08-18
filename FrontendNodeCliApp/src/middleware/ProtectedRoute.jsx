import { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { userContext } from '../context/UserAuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(userContext);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children;
}

export default ProtectedRoute