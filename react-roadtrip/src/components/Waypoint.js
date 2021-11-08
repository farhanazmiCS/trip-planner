import mapboxgl from 'mapbox-gl';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Todo from './Todo'


export default function Waypoint({show, onHide}) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                Waypoint
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Query Location</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>From</Form.Label><Form.Control type="date"/><Form.Control type="time" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>To</Form.Label><Form.Control type="date"/><Form.Control type="time" />
                    </Form.Group>
                    <Form.Group>
                        <Todo />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button>Add Point</Button>
            </Modal.Footer>
        </Modal>
    )
}