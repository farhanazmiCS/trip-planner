import {Link} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import NavigationBar from '../components/NavigationBar';
import {tripDataExport} from '../App';

export default function Trips() {
    return (
        <>
            <NavigationBar />
            <Container>
                <Container>
                    <h1 style={{fontWeight: 'bolder'}} className="mt-2">My Trips</h1>
                    <hr />
                </Container>
                {tripDataExport.map(trip => (
                    <Container key={trip.id} className="d-grid gap-2">
                        <Link to={`trips/${trip.id}`} style={{textDecoration: 'none'}} key={trip.name}>
                            <Button className="mb-2" variant="outline-dark" style={{textAlign: 'left'}}>
                                <h3>{trip.name}</h3>
                                <p className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                            </Button>
                        </Link>
                    </Container>
                ))}
            </Container>
        </>
    )
}