import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import Waypoint from '../components/Waypoint';
import { useState } from 'react';

export default function CreateTrip({state}) {
    const [show, setShow] = useState(false);
    const showModal = () => {
        setShow(true);
    }
    const hideModal = () => {
        setShow(false);
    }
    return (
        <>
            <Container style={{display: state}}>
                <h1>Create a Trip</h1>
                <hr />
            </Container>
            <Button style={{display: state}} onClick={showModal}>Create trip</Button>
            <Waypoint style={{display: state}} show={show} onHide={hideModal} />
        </>
    )
}