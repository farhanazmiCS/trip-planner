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
    document.title = 'RoadTrip: Create Trip';
    // Username and token for auth
    const username = sessionStorage.getItem('username');
    const auth_token = sessionStorage.getItem(username);

    // Mapbox access token
    const access_token = 'API_KEY';
    
    /**
     * Function that allows the user to add an origin waypoint
     */
    function addOriginModal() {
        setShow(true);
        setWaypointType({
            isOrigin: true,
            isDestination: false
        });
        setSingleOption([]);
    }
    /**
     * Function that allows the user to add stopover waypoints
     */
    function addStopoverModal() {
        setShow(true);
        setSingleOption([]);
    }
    /**
     * Function that allows the user to add the destination
     */
    function addDestinationModal() {
        setShow(true);
        setWaypointType({
            isOrigin: false,
            isDestination: true
        });
        setSingleOption([]);
    }
    
    // editModal function, inherited from App.
    const editModal = props.editModal;

    // hideModal function, inherited from App.
    const hideModal = props.hideModal;

    // API endpoint
    const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    // State declaration for handling location search
    const [isLoading, setIsLoading] = useState(false);

    // Options for location
    const [options, setOptions] = useState([]);
    const singleOption = props.singleOption;
    const setSingleOption = props.setSingleOption;

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

    // Status of modal
    const show = props.show;
    const setShow = props.setShow;

    // Key, for editing waypoint
    const key = props.k;

    // dateTime
    const dateTime = props.dateTime;
    const setDateTime = props.setDateTime;

    // Todo objects
    const todoObjects = props.todoObjects;

    // Add Todo objects
    const addTodo = props.addTodo;

    // Handle Todo input field change
    const onTodoChange = props.onTodoChange;

    // Remove Todo objects
    const removeTodo = props.removeTodo;
        
    // State of waypoint(s)
    const waypoints = props.waypoints;
    const setWaypoints = props.setWaypoints;

    // Waypoint type, when editing waypoint
    const waypointType = props.waypointType;
    const setWaypointType = props.setWaypointType;

    // Edit, if true, shows the edit button on a modal
    const edit = props.edit;

    // Error message
    const [error, setError] = useState(null);

    const me = props.users.find(user => user.username === sessionStorage.getItem('username'));
    
    // Inherit title props from App component
    const title = props.title;
    const updateTitle = props.updateTitle;
    const titleFieldStyle = props.titleFieldStyle;
    const setTitleFieldStyle = props.setTitleFieldStyle;
    const titleField = props.titleField;
    const setTitleField = props.setTitleField;

    const addOrigin = () => {
        waypoints.push({
            type: 'origin',
            dateFrom: dateTime.dateFrom,
            dateTo: dateTime.dateTo,
            timeFrom: dateTime.timeFrom,
            timeTo: dateTime.timeTo,
            text: singleOption[0].text,
            place_name: singleOption[0].place_name,
            todo: todoObjects,
            longitude: singleOption[0].longitude,
            latitude: singleOption[0].latitude
        })
        setWaypoints([...waypoints]);
        hideModal();
    }

    const addDestination = () => {
        waypoints.push({
            type: 'destination',
            dateFrom: dateTime.dateFrom,
            dateTo: dateTime.dateTo,
            timeFrom: dateTime.timeFrom,
            timeTo: dateTime.timeTo,
            text: singleOption[0].text,
            place_name: singleOption[0].place_name,
            todo: todoObjects,
            longitude: singleOption[0].longitude,
            latitude: singleOption[0].latitude
        })
        setWaypoints([...waypoints]);
        hideModal();
    }

    // Create waypoint event handler
    const addStopover = () => {
        if (waypoints.find(waypoint => waypoint.type === 'destination') === undefined) {
            waypoints.push({
                type: 'stopover',
                dateFrom: dateTime.dateFrom,
                dateTo: dateTime.dateTo,
                timeFrom: dateTime.timeFrom,
                timeTo: dateTime.timeTo,
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
                dateFrom: dateTime.dateFrom,
                dateTo: dateTime.dateTo,
                timeFrom: dateTime.timeFrom,
                timeTo: dateTime.timeTo,
                text: singleOption[0].text,
                place_name: singleOption[0].place_name,
                todo: todoObjects,
                longitude: singleOption[0].longitude,
                latitude: singleOption[0].latitude
            });
        }
        setWaypoints([...waypoints]);
        hideModal();
    }

    // Edit waypoint event handler
    const modifyWaypoint = (key) => {
        waypoints[key].dateFrom = dateTime.dateFrom;
        waypoints[key].dateTo = dateTime.dateTo;
        waypoints[key].timeFrom = dateTime.timeFrom;
        waypoints[key].timeTo = dateTime.timeTo;
        waypoints[key].todo = todoObjects;
        waypoints[key].text = singleOption[0].text;
        waypoints[key].place_name = singleOption[0].place_name;
        waypoints[key].longitude = singleOption[0].longitude;
        waypoints[key].latitude = singleOption[0].latitude;
        setWaypoints([...waypoints]);
        hideModal();
    }

    // Delete waypoint event handler
    const removeWaypoint = (key) => {
        waypoints.splice(key, 1);
        setWaypoints([...waypoints]);
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
                                    me={me}
                                    key={(waypoint.text + waypoint.place_name).toUpperCase() + index.toString()}
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
                                    editWaypoint={editModal}
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
                        dateTime={dateTime}
                        dateFrom={dateTime.dateFrom}
                        dateTo={dateTime.dateTo}
                        timeFrom={dateTime.timeFrom}
                        timeTo={dateTime.timeTo}
                        setDateTime={setDateTime}
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
                        isOrigin={waypointType.isOrigin}    
                        isDestination={waypointType.isDestination}
                        singleOption={singleOption}
                        setSingleOption={setSingleOption}  
                    />
                </>
            }
        </>
    )
}