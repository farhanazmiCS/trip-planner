import { Container } from 'react-bootstrap';
import Map from '../components/Map';

export default function Trip(props) {
    return (
        <Container>
            <h1 className="mt-2" style={{fontWeight: 'bolder'}}>{props.trip.name}</h1>
            <hr />
            <Map state={props.mapState}/>
        </Container>
    )
}