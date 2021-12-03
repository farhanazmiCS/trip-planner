
import {Link} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

// For Trip component
export function getTrip(trips, id) {
    return trips.find(
        trip => trip.id === id
    );
}

export default function Trips(props) {
    return (
        <>
            {props.isLoggedIn && 
                <Container>
                    <Container>
                        <h1 style={{fontWeight: 'bolder'}} className="mt-2">My Trips</h1>
                        <hr />
                    </Container>
                    {props.myTrips.map(trip => (
                        <Link style={{textDecoration: 'none'}} to={`/trips/${trip.id}`} key={trip.id}>
                            <Container key={`trips-${trip.id}`} className="d-grid gap-2">
                                <Button key={'button-' + trip.id} className="mb-2" variant="outline-dark" style={{textAlign: 'left'}}>
                                    <h3 key={trip.name}>{trip.name}</h3>
                                    <p key={trip.origin.name + '-' + trip.destination.name} className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                                </Button>
                            </Container>
                        </Link>
                    ))}
                </Container>
            }
        </>
    )
}