import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import WaypointModal from '../components/WaypointModal';
import { Fragment, useState } from 'react';
import Waypoint from '../components/Waypoint';

// FontAwesome Icon
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

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

    // API endpoint
    const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    // State declaration for handling location search
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    // Handle location search
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

    // Todo objects
    const [todoObjects, setTodoObjects] = useState([]);

    // Add Todo objects
    const addTodo = () => {
        setTodoObjects([...todoObjects, {value: ''}]);
    }

    // Handle Todo input field change
    // Inspired by https://codesandbox.io/s/o54n9zwnly?file=/src/index.js. @u/jenovs
    const onTodoChange = (event, index) => {
        // Set the value to the updated field's value
        todoObjects[index].value = event.target.value;
        // Update the todoObjects array
        setTodoObjects([...todoObjects]);
    }

    // Remove Todo objects
    const removeTodo = (key) => {
        todoObjects.splice(key, 1);
        setTodoObjects([...todoObjects]);
    }

    // Date
    let today = new Date();

    // To format dates
    switch(String(today.getDate()).length) {
        case 1:
            var day = '0' + today.getDate();
            break;
        default:
            day = today.getDate();
    }

    switch(String(today.getMonth()).length) {
        case 1:
            var month = '0' + (1 + today.getMonth());
            break;
        default:
            month = 1 + today.getMonth();
    }    

    switch(String(today.getMinutes()).length) {
        case 1:
            var minutes = '0' + today.getMinutes();
            break;
        default:
            minutes = today.getMinutes();
    }
    
    const date = today.getFullYear() + '-' + month + '-' + day;
    const now = today.getHours() + ':' + minutes;
    
    // Set initial state to today's date
    const [dateFrom, setDateFrom] = useState(date);
    const [dateTo, setDateTo] = useState(date);
    
    // Set initial state to today's time
    const [timeFrom, setTimeFrom] = useState(now);
    const [timeTo, setTimeTo] = useState(now);

    // Current key
    const [key, setKey] = useState(null);

    // Edit button state, and functions to show and hide the edit button (Also used to show/hide the add button)
    const [edit, showEdit] = useState(false);
    const hideEdit = () => {
        showEdit(false);
    }
    const displayEdit = () => {
        showEdit(true);
    }

    // State of waypoint(s)
    const [waypoints, setWaypoints] = useState([]);

    // Create waypoint event handler
    const addWaypoint = () => {
        setWaypoints([...waypoints, {
            dateFrom: dateFrom,
            dateTo: dateTo,
            timeFrom: timeFrom,
            timeTo: timeTo,
            text: options[0].text,
            place_name: options[0].place_name,
            todo: todoObjects
        }]);
        hideModal();
        // Setting modal fields back to default
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
    }

    // When the edit button on the WaypointModal is clicked, save the data into the waypoint
    const modifyWaypoint = (key) => {
        waypoints[key].dateFrom = dateFrom;
        waypoints[key].dateTo = dateTo;
        waypoints[key].timeFrom = timeFrom;
        waypoints[key].timeTo = timeTo;
        waypoints[key].todo = todoObjects;
        waypoints[key].text = options[0].text;
        waypoints[key].place_name = options[0].place_name;
        setWaypoints([...waypoints]);
        hideModal();
    }

    // For deleting waypoint objects
    const removeWaypoint = (key) => {
        waypoints.splice(key, 1);
        setWaypoints([...waypoints]);
    }

    // For clicking the edit button on the Waypoint to show the modal
    const editWaypoint = (key) => {
        displayEdit();
        setKey(key);
        setDateFrom(waypoints[key].dateFrom);
        setTimeFrom(waypoints[key].timeFrom);
        setDateTo(waypoints[key].dateTo);
        setTimeTo(waypoints[key].timeTo);
        setTodoObjects(waypoints[key].todo);
        showModal();
    }

    // For adding a waypoint, displaying a modal and emptying the fields
    const addWaypointModal = () => {
        hideEdit();
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
        showModal();
    }

    return (
        <>
            <Container>
                <h1 style={{fontWeight: 'bolder'}} className="mt-2">Create a Trip</h1>
                <hr />
                <Fragment>
                    {waypoints.map((waypoint, index) => (
                        <Waypoint
                            key={(waypoint.text + '' + waypoint.place_name).toUpperCase()}
                            id={index} 
                            dateFrom={waypoint.dateFrom} 
                            dateTo={waypoint.dateTo} 
                            timeFrom={waypoint.timeFrom} 
                            timeTo={waypoint.timeTo} 
                            text={waypoint.text} 
                            place={waypoint.place_name}
                            todo={waypoint.todo} 
                            removeWaypoint={removeWaypoint}
                            editWaypoint={editWaypoint}
                        />
                    ))}
                </Fragment>
                <div className="mt-3 mb-3">
                    <Container className="d-flex justify-content-center">
                        <Button className="mx-2" variant="dark" onClick={addWaypointModal}>Add Waypoint <FontAwesomeIcon icon={faMapMarkerAlt} /></Button>
                        <Button className="btn-danger mx-2">Set Destination</Button>
                    </Container>
                </div>
            </Container>
            <WaypointModal show={show} 
                onHide={hideModal} 
                props={{
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    timeFrom: timeFrom,
                    timeTo: timeTo,
                    token: access_token
                }}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                setTimeFrom={setTimeFrom}
                setTimeTo={setTimeTo}
                addWaypoint={addWaypoint}
                modifyWaypoint={modifyWaypoint}
                addTodo={addTodo}
                removeTodo={removeTodo}
                onTodoChange={onTodoChange}
                todoObjects={todoObjects}
                handleSearch={handleSearch}
                filterBy={filterBy}
                isLoading={isLoading}
                options={options}
                index={key}             
                modifyWaypoint={modifyWaypoint}   
                edit={edit}           
            />
        </>
    )
}