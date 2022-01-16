import { Navigate } from 'react-router';

// Loads "Trips" or "Login" pages depending on the auth status
export default function Home(props) {
    if (sessionStorage.getItem(sessionStorage.getItem('username')) !== null) {
        return (
            <Navigate to="/trips" />
        )
    }
    else {
        return (
            <Navigate to="/login" />
        )
    }
}
