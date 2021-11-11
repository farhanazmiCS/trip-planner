import {Fragment} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';

// FontAwesome Icon
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

export default function WaypointModal({
    show, 
    onHide, 
    props, 
    setLocation, 
    setDateFrom, 
    setDateTo, 
    setTimeFrom, 
    setTimeTo, 
    addWaypoint, 
    handleSearch, 
    addTodo, 
    todoObjects,
    isLoading, 
    options,
    filterBy
}) {
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
                <div className="d-grid gap-2">
                    <Button variant="primary" onClick={addWaypoint}>Add Point</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}