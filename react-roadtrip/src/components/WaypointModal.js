import mapboxgl from 'mapbox-gl';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import Todo from './Todo'


export default function WaypointModal({show, onHide, props, setLocation, setDateFrom, setDateTo, setTimeFrom, setTimeTo}) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                Waypoint
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Query Location</Form.Label>
                        <Form.Control className="mb-3" type="text" value={props.location} onChange={(e) => setLocation(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>From</Form.Label>
                        <Form.Control className="mb-3" type="date" value={props.dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        <Form.Control className="mb-3" type="time" value={props.timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>To</Form.Label>
                        <Form.Control className="mb-3" type="date" value={props.dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        <Form.Control className="mb-3" type="time" value={props.timeTo} onChange={(e) => setTimeTo(e.target.value)} />
                    </Form.Group>
                    <Todo />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button>Add Point</Button>
            </Modal.Footer>
        </Modal>
    )
}