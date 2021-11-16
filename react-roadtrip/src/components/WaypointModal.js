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

export default function WaypointModal({
    show, 
    onHide, 
    props, 
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
    filterBy,
    removeTodo,
    onTodoChange,
    index,
    modifyWaypoint,
    edit
}) {
    return (
        <Modal scrollable={true} show={show} onHide={onHide}>
            <Modal.Header style={{fontWeight: 'bold', fontSize: '20px'}} closeButton>
                Add Point
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
                            labelKey="text"
                            options={options}
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
                        {todoObjects.map((todoObject, index) => (
                            <Todo key={index} id={index} value={todoObject.value} onChange={(event) => onTodoChange(event, index)} removeTodo={removeTodo} />
                        ))}
                    </Fragment>
                    <div className="d-grid gap-2">
                        <Button variant="dark" className="mb-3" onClick={addTodo}> Add Plan <FontAwesomeIcon icon={faPlus} /></Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-evenly">
                    {!edit && <Button className="mx-1" variant="dark" onClick={addWaypoint}>Add Point</Button>}
                    {edit && <Button className="mx-1" variant="dark" onClick={() => modifyWaypoint(index)}>Edit <FontAwesomeIcon icon={faPen} style={{color : 'white'}} /></Button>}
                </div>
            </Modal.Footer>
        </Modal>
    )
}