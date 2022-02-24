import { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import Todo from './Todo';

export default function WaypointModal(props) {
    return (
        <Modal scrollable={true} show={props.show} onHide={props.onHide}>
            <Modal.Header style={{fontWeight: 'bold', fontSize: '20px'}} closeButton>
                {props.edit && !props.isDestination && 'Edit Point'}
                {!props.edit && !props.isDestination && props.isOrigin && 'Set Origin'}
                {!props.edit && !props.isDestination && !props.isOrigin && 'Add Stopover'}
                {!props.edit && props.isDestination && 'Set Destination'}
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <h4>Query Location</h4>
                        <AsyncTypeahead
                            className="mb-3"
                            inputProps={{ required: true }}
                            id="location"
                            minLength={5}
                            filterBy={props.filterBy}
                            isLoading={props.isLoading}
                            onSearch={props.handleSearch}
                            labelKey="text"
                            options={props.options}
                            onChange={props.setSingleOption}
                            selected={props.singleOption}
                            placeholder="Enter a location..."
                            renderMenuItemChildren={(options) => (
                                <Fragment>
                                    <h6 style={{color: 'black', fontSize: '16px'}}>{options.text}</h6>
                                    <p style={{color: 'grey', fontSize: '14px'}}>{options.place_name}</p>
                                </Fragment>
                            )} 
                        />
                    </Form.Group>
                    <h4>Period</h4>
                    <Form.Group>
                        <Form.Label>From</Form.Label>
                        <Form.Control className="mb-3" type="date" value={props.dateFrom} onChange={(e) => props.setDateTime({...props.dateTime, dateFrom: e.target.value})} />
                        <Form.Control className="mb-3" type="time" value={props.timeFrom} onChange={(e) => props.setDateTime({...props.dateTime, timeFrom: e.target.value})} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>To</Form.Label>
                        <Form.Control className="mb-3" type="date" value={props.dateTo} onChange={(e) => props.setDateTime({...props.dateTime, dateTo: e.target.value})} />
                        <Form.Control className="mb-3" type="time" value={props.timeTo} onChange={(e) => props.setDateTime({...props.dateTime, timeTo: e.target.value})} />
                    </Form.Group>
                    <h4>Todo</h4>
                    <Fragment>
                        {props.todoObjects.map((todoObject, index) => (
                            <Todo key={index} id={index} value={todoObject.value} onChange={(event) => props.onTodoChange(event, index)} removeTodo={props.removeTodo} />
                        ))}
                    </Fragment>
                    <div className="d-grid gap-2">
                        <Button variant="dark" className="mb-3" onClick={props.addTodo}> Add Plan <FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-evenly">
                    {props.isOrigin && <Button className="mx-1" variant="dark" onClick={props.addOrigin}>Set Origin</Button>}
                    {props.isDestination && <Button className="mx-1" variant="dark" onClick={props.addDestination}>Set Destination</Button>}
                    {!props.edit && !props.isDestination && !props.isOrigin && <Button className="mx-1" variant="dark" onClick={props.addStopover}>Add Point</Button>}
                    {props.edit && <Button className="mx-1" variant="dark" onClick={() => props.modifyWaypoint(props.index)}>Edit <FontAwesomeIcon icon={faPen} style={{color : 'white'}} /></Button>}
                </div>
            </Modal.Footer>
        </Modal>
    )
}