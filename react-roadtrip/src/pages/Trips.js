import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Trips(props) {
    return (
        <>
            <Container>
                <Container>
                    <h1 style={{fontWeight: 'bolder'}} className="mt-2">My Trips</h1>
                    <hr />
                </Container>
                {props.myTrips.map((trip, index)=> (
                    <Container key={trip.id} className="d-grid gap-2">
                        <Button className="mb-2" variant="outline-dark" style={{textAlign: 'left'}} onClick={() => props.viewSpecificTrip(index)}>
                            <h3>{trip.name}</h3>
                            <p className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                        </Button>
                    </Container>
                ))}
            </Container>
        </>
    )
}