import { Container } from 'react-bootstrap';
import Map from '../components/Map';
import { useParams } from 'react-router-dom';
import {getTrip} from '../pages/Home';

export default function Trip() {
    let params = useParams();
    let trip = getTrip(parseInt(params.tripId))
    return (
        <Container>
            <h1 className="mt-2" style={{fontWeight: 'bolder'}}>{trip.name}</h1>
            <hr />
            <Map />
        </Container>
    )
}