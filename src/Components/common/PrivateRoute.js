import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return children;
}

export { PrivateRoute };
