import {Fragment, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';

// FontAwesome Icon
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

// Todo component
import Todo from './Todo'

export default function WaypointModal({show, onHide, props, setLocation, setDateFrom, setDateTo, setTimeFrom, setTimeTo}) {
    // Mapbox access token
    const access_token = props.token;
    // API endpoint
    const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (query) => {
        setIsLoading(true);

        fetch(`${endpoint}/${query}.json?limit=5&access_token=${access_token}`)
        .then(response => response.json())
        .then(result => {
            // Contains id, text and place_name
            const features = result['features'];
            return features;
        })
        .then(features => {
            const options = features.map((item) => ({
                id: item.id,
                text: item.text,
                place_name: item.place_name
            }));
            setOptions(options);
            setIsLoading(false);
        });
    }
    // Returns 'true' to bypass client-side filtering, as results are already filtered by API endpoint.
    const filterBy = () => true;

    const [todoObjects, setTodoObjects] = useState([]);
    const [todoCount, setTodoCount] = useState(1);

    // For id
    const addTodoCount = () => {
        setTodoCount(todoCount + 1);
    }

    // Add Todo
    const addTodo = () => {
        addTodoCount();
        setTodoObjects([...todoObjects, <Todo id={todoCount.toString()} removeTodo={removeTodo} />]);
    }

    const removeTodo = () => {
        // TODO        
    }

    return (
        <Modal scrollable={true} show={show} onHide={onHide}>
            <Modal.Header closeButton>
                Waypoint
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <h4>Query Location</h4>
                        <AsyncTypeahead
                            className="mb-3"
                            id="location"
                            filterBy={filterBy}
                            isLoading={isLoading}
                            onSearch={handleSearch}
                            labelKey="place_name"
                            options={options}
                            placeholder="Enter a location"
                            value={(e) => setLocation(e.target.value)}
                            renderMenuItemChildren={(options) => (
                                <Fragment>
                                    <p style={{color: 'grey', fontSize: '14px'}}>{options.place_name}</p>
                                </Fragment>
                            )} 
                        />
                    </Form.Group>
                    <h4>Period</h4>
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
                    <h4>Todo</h4>
                    <Fragment>
                        {todoObjects}
                    </Fragment>
                    <div className="d-grid gap-2">
                        <Button className="mb-3" variant="primary" onClick={addTodo}> Add Plan <FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button>Add Point</Button>
            </Modal.Footer>
        </Modal>
    )
}