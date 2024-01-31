import {Navigate} from "react-router-dom";
import {toast} from 'react-toastify';
export default function ProtectedRoute ({children}) {
    const user = localStorage.getItem('username');
    if (!user) {
        // user is not authenticated
        toast('You should login first!');
        return <Navigate to="/"/>;
    }
    return children;
};

