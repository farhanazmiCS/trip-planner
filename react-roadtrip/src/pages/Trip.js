import { Container } from 'react-bootstrap';
import Map from '../components/Map';
import { useParams } from 'react-router-dom';
import { getTrip } from '../pages/Trips';

export default function Trip(props) {
    let params = useParams();
    let trip = getTrip(props.myTrips, parseInt(params.tripId))
    return (
        <Container>
            <h1 className="mt-2" style={{fontWeight: 'bolder'}}>{trip.name}</h1>
            <hr />
            <Map />
        </Container>
    )
}