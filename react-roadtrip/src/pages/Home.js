import Trips from './Trips';

// For Trip component
export function getTrip(props, id) {
    return props.tripData.find(
        trip => trip.id === id
    );
}

// Loads "Trips" or "Login" pages depending on the auth status
export default function Home(props) {
    return (
        <>
            {props.isLoggedIn && 
                <Trips trips={props.myTrips} />
            }
        </>
    )
}
