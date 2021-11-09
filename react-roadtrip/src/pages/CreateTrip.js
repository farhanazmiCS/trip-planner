import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import WaypointModal from '../components/WaypointModal';
import { useState } from 'react';

// Mapbox
import mapboxgl from 'mapbox-gl';

export default function CreateTrip() {
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
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + 0 + today.getDate();
    }
    else {
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }

    if (today.getHours().length !== 2) {
        var now = 0 + today.getHours() + ':' + today.getMinutes();
    }
    else if (today.getMinutes().length !== 2) {
        var now = today.getHours() + ':' + 0 + today.getMinutes();
    }
    else {
        var now = today.getHours() + ':' + today.getMinutes();
    }

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
            <Container>
                <h1 style={{fontWeight: 'bolder'}} className="mt-2">Create a Trip</h1>
                <hr />
                <Button onClick={showModal}>Create trip</Button>
            </Container>
            <WaypointModal 
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