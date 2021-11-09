import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import WaypointModal from '../components/WaypointModal';
import { useState } from 'react';

// Mapbox
import mapboxgl from 'mapbox-gl';

export default function CreateTrip({state}) {
    // Mapbox access token
    const access_token = 'API_KEY';

    // Modal Control
    const [show, setShow] = useState(false);
    const showModal = () => {
        setShow(true);
    }
    const hideModal = () => {
        setShow(false);
    }

    // Date
    let today = new Date();
    if (today.getDate().length !== 2) {
        var date = today.getFullYear() + '-' + today.getMonth() + '-' + 0 + today.getDate();
    }
    else {
        var date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    }

    // Time
    let now = today.getHours() + ':' + today.getMinutes();

    // Location fields
    const [location, setLocation] = useState('');

    // Set initial state to today's date
    const [dateFrom, setDateFrom] = useState(date);
    const [dateTo, setDateTo] = useState(date);

    // Set initial state to today's time
    const [timeFrom, setTimeFrom] = useState(now);
    const [timeTo, setTimeTo] = useState(now);

    return (
        <>
            <Container style={{display: state}}>
                <h1>Create a Trip</h1>
                <hr />
                <Button onClick={showModal}>Create trip</Button>
            </Container>
            <WaypointModal 
                style={{display: state}} 
                show={show} 
                onHide={hideModal} 
                props={{
                    location: location,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    timeFrom: timeFrom,
                    timeTo: timeTo,
                    token: access_token
                }}
                setLocation={setLocation}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                setTimeFrom={setTimeFrom}
                setTimeTo={setTimeTo}
            />
        </>
    )
}