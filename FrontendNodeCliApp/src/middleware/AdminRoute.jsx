import { useContext } from "react"
import { userContext } from "../context/UserAuthContext"
import { Navigate } from "react-router-dom";


const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(userContext);

    // While auth state is loading, don't redirect — let fetchUser finish
    if (loading) return null;

    if (!user) {
        return <Navigate to='/login' />
    }

    // handle role check safely
    if ((user.role ?? '').toLowerCase() !== 'admin') {
        return <Navigate to='/' />
    }

    return children;
}

export default AdminRoute