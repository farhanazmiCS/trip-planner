import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import WaypointModal from '../components/WaypointModal';
import { Fragment, useState } from 'react';
import Waypoint from '../components/Waypoint';
import { InputGroup } from 'react-bootstrap';

// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMapMarkerAlt, faPen } from '@fortawesome/free-solid-svg-icons';

export default function CreateTrip(props) {
    // Username and token for auth
    const username = sessionStorage.getItem('username');
    const auth_token = sessionStorage.getItem(username);

    // Mapbox access token
    const access_token = 'YOUR_ACCESS_TOKEN';

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

    // Options for location
    const [options, setOptions] = useState([]);
    const [singleOption, setSingleOption] = useState([]);

    // Handle location search
    const handleSearch = (query) => {
        setIsLoading(true);

        fetch(`${endpoint}/${query}.json?limit=10&access_token=${access_token}`)
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
                place_name: item.place_name,
                longitude: item.center[0],
                latitude: item.center[1]
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

    // To format date and time
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

    switch(String(today.getHours()).length) {
        case 1:
            var hours = '0' + today.getHours();
            break;
        default:
            hours = today.getHours();
    }

    switch(String(today.getMinutes()).length) {
        case 1:
            var minutes = '0' + today.getMinutes();
            break;
        default:
            minutes = today.getMinutes();
    }
    
    const date = today.getFullYear() + '-' + month + '-' + day;
    const now = hours + ':' + minutes;
    
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

    // State to identify origin waypoint
    const [isOrigin, setIsOrigin] = useState(false);
    // State to identify destination waypoint
    const [isDestination, setIsDestination] = useState(false);

    // Error message
    const [error, setError] = useState(null);

    // State of trip title
    const [title, setTitle] = useState('Trip Name');
    const [titleFieldStyle, setTitleFieldStyle] = useState('border border-dark');
    
    // If true, show the editable field, else show a header
    const [titleField, setTitleField] = useState(false);

    const updateTitle = (e) => {
        setTitleFieldStyle('border border-dark');
        setTitle(e.target.value);
        setError(null);
    }

    const addOrigin = () => {
        waypoints.push({
            type: 'origin',
            dateFrom: dateFrom,
            dateTo: dateTo,
            timeFrom: timeFrom,
            timeTo: timeTo,
            text: singleOption[0].text,
            place_name: singleOption[0].place_name,
            todo: todoObjects,
            longitude: singleOption[0].longitude,
            latitude: singleOption[0].latitude
        })
        setWaypoints([...waypoints]);
        hideModal();
        // Setting modal fields back to default
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
    }

    const addDestination = () => {
        waypoints.push({
            type: 'destination',
            dateFrom: dateFrom,
            dateTo: dateTo,
            timeFrom: timeFrom,
            timeTo: timeTo,
            text: singleOption[0].text,
            place_name: singleOption[0].place_name,
            todo: todoObjects,
            longitude: singleOption[0].longitude,
            latitude: singleOption[0].latitude
        })
        setWaypoints([...waypoints]);
        hideModal();
        // Setting modal fields back to default
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
    }

    // Create waypoint event handler
    const addStopover = () => {
        if (waypoints.find(waypoint => waypoint.type === 'destination') === undefined) {
            waypoints.push({
                type: 'stopover',
                dateFrom: dateFrom,
                dateTo: dateTo,
                timeFrom: timeFrom,
                timeTo: timeTo,
                text: singleOption[0].text,
                place_name: singleOption[0].place_name,
                todo: todoObjects,
                longitude: singleOption[0].longitude,
                latitude: singleOption[0].latitude
            })
        }
        else if (waypoints.find(waypoint => waypoint.type === 'destination') !== undefined) {
            waypoints.splice(waypoints.length - 1, 0, {
                type: 'stopover',
                dateFrom: dateFrom,
                dateTo: dateTo,
                timeFrom: timeFrom,
                timeTo: timeTo,
                text: singleOption[0].text,
                place_name: singleOption[0].place_name,
                todo: todoObjects,
                longitude: singleOption[0].longitude,
                latitude: singleOption[0].latitude
            });
        }
        setWaypoints([...waypoints]);
        hideModal();
        // Setting modal fields back to default
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
    }

    // Edit waypoint event handler
    const modifyWaypoint = (key) => {
        waypoints[key].dateFrom = dateFrom;
        waypoints[key].dateTo = dateTo;
        waypoints[key].timeFrom = timeFrom;
        waypoints[key].timeTo = timeTo;
        waypoints[key].todo = todoObjects;
        if (singleOption[key] !== undefined) {
            waypoints[key].text = singleOption[0].text;
            waypoints[key].place_name = singleOption[0].place_name;
            waypoints[key].longitude = singleOption[0].longitude;
            waypoints[key].latitude = singleOption[0].latitude;
        }
        setWaypoints([...waypoints]);
        hideModal();
    }

    // Delete waypoint event handler
    const removeWaypoint = (key) => {
        waypoints.splice(key, 1);
        setWaypoints([...waypoints]);
    }

    // Display modal for editing waypoints
    const editWaypointModal = (key) => {
        setSingleOption([waypoints[key]]);
        setIsOrigin(false);
        setIsDestination(false);
        displayEdit();
        setKey(key);
        setDateFrom(waypoints[key].dateFrom);
        setTimeFrom(waypoints[key].timeFrom);
        setDateTo(waypoints[key].dateTo);
        setTimeTo(waypoints[key].timeTo);
        setTodoObjects(waypoints[key].todo);
        showModal();
    }

    const addOriginModal = () => {
        setSingleOption([]);
        setIsOrigin(true);
        setIsDestination(false);
        hideEdit();
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
        showModal();
    }

    // Display modal for adding waypoints
    const addStopoverModal = () => {
        setSingleOption([]);
        setIsOrigin(false);
        setIsDestination(false);
        hideEdit();
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
        showModal();
    }

    // Display Waypoints for adding a destination
    const addDestinationModal = () => {
        setSingleOption([]);
        setIsOrigin(false);
        setIsDestination(true);
        hideEdit();
        setTodoObjects([]);
        setDateFrom(date);
        setDateTo(date);
        setTimeFrom(now);
        setTimeTo(now);
        showModal();
    }

    // Save the trip
    const saveTrip = (e) => {
        let request = new Request(
            'http://127.0.0.1:8000/trips/save_trip/', {
                headers: {
                    'Authorization': `Token ${auth_token}`
                }
            }
        );
        fetch(request, {
            method: 'POST',
            body: JSON.stringify({
                tripName: title,
                waypoints: waypoints,
            })
        })
        .then(response => {
            if (response.status !== 200) {
                response.json().then(body => {
                    setError(body['error']);
                    setTitleField(true);
                    setTitleFieldStyle('border border-danger');
                    return;
                });
            }
            props.setTripCounter(props.tripCounter + 1);
        })
        .then(() => {
            props.navigate('/trips');
        })
        e.preventDefault();
    }
    return (
        <>
            {props.isLoggedIn && 
                <>
                    <Container>
                        <Container>
                            <h1 style={{fontWeight: 'bolder', textAlign: 'center'}} className="mt-2">Create a Trip</h1>
                            <hr />
                        </Container>
                        {!titleField && title !== '' && <Container>
                            <h3 className="mb-3" id="trip-name" style={{display: 'inline-block'}}>{title}</h3><FontAwesomeIcon className="mx-2" style={{display: 'inline-block'}} icon={faPen} onClick={() => setTitleField(true)} />
                        </Container>}
                        {!titleField && title === '' && <Container>
                            <h3 className="mb-3" id="trip-name" style={{display: 'inline-block'}}>Trip Name</h3><FontAwesomeIcon className="mx-2" style={{display: 'inline-block'}} icon={faPen} onClick={() => setTitleField(true)} />
                        </Container>}
                        {titleField && <Container><InputGroup className="mb-3">
                            <FormControl size="lg" className={titleFieldStyle} aria-describedby="done" style={{display: 'inline-block'}} type="text" value={title} onChange={updateTitle} />
                            <Button variant="dark" className={titleFieldStyle} id="done" onClick={() => setTitleField(false)}><FontAwesomeIcon icon={faCheck} /></Button>
                        </InputGroup></Container>}
                        {error && <Container><p style={{color: 'red'}} className="mb-3">{error}</p></Container>}
                        <Fragment>
                            {waypoints.map((waypoint, index) => (
                                <Waypoint
                                    key={(waypoint.text + waypoint.place_name).toUpperCase()}
                                    type={waypoint.type}
                                    id={index} 
                                    dateFrom={waypoint.dateFrom} 
                                    dateTo={waypoint.dateTo} 
                                    timeFrom={waypoint.timeFrom} 
                                    timeTo={waypoint.timeTo} 
                                    text={waypoint.text} 
                                    place={waypoint.place_name}
                                    todo={waypoint.todo} 
                                    removeWaypoint={removeWaypoint}
                                    editWaypoint={editWaypointModal}
                                    waypointLength={waypoints.length}
                                />
                            ))}
                        </Fragment>
                        <div className="mt-3 mb-3">
                            <Container className="d-flex justify-content-center">
                                {/* For only showing Origin button */}
                                {waypoints.find(waypoint => waypoint.type === 'origin') === undefined && <Button className="mx-2" variant="dark" onClick={addOriginModal}>Set Origin</Button>}
                                {/* For showing both Stopover and Destination buttons */}
                                {waypoints.find(waypoint => waypoint.type === 'destination') === undefined && waypoints.find(waypoint => waypoint.type === 'origin') !== undefined && <><Button className="mx-2" variant="dark" onClick={addStopoverModal}>Add Stopovers</Button><Button className="btn-danger mx-2" onClick={addDestinationModal}>Set Destination</Button></>}
                                {/* For only showing Stopover button */}
                                {waypoints.find(waypoint => waypoint.type === 'destination') && <Button className="mx-2" variant="dark" onClick={addStopoverModal}>Add Stopovers <FontAwesomeIcon icon={faMapMarkerAlt} /></Button>}
                                {/* For showing the Save Trip button */}
                                {waypoints.find(waypoint => waypoint.type === 'origin') && waypoints.find(waypoint => waypoint.type === 'destination') && <Button className="mx-2" variant="dark" onClick={saveTrip}>Save Trip</Button>}
                            </Container>
                        </div>
                    </Container>
                    <WaypointModal show={show}
                        onHide={hideModal} 
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        timeFrom={timeFrom}
                        timeTo={timeTo}
                        token={access_token}
                        setDateFrom={setDateFrom}
                        setDateTo={setDateTo}
                        setTimeFrom={setTimeFrom}
                        setTimeTo={setTimeTo}
                        addOrigin={addOrigin}
                        addStopover={addStopover}
                        addDestination={addDestination}
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
                        edit={edit}  
                        isOrigin={isOrigin}    
                        isDestination={isDestination}
                        singleOption={singleOption}
                        setSingleOption={setSingleOption}  
                    />
                </>
            }
        </>
    )
}