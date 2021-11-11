import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import WaypointModal from '../components/WaypointModal';
import { Fragment, useState } from 'react';
import Waypoint from '../components/Waypoint';
import Todo from '../components/Todo';

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

    // Todo objects and their corresponding ID
    const [todoObjects, setTodoObjects] = useState([]);
    const [todoCount, setTodoCount] = useState(1);

    // For setting Todo ID
    const addTodoCount = () => {
        setTodoCount(todoCount + 1);
    }

    // Add Todo objects
    const addTodo = () => {
        addTodoCount();
        setTodoObjects([...todoObjects, <Todo id={todoCount.toString()} removeTodo={removeTodo} />]);
    }

    const removeTodo = () => {
        // TODO        
    }

    // Location fields input
    const [location, setLocation] = useState('');

    // Date
    let today = new Date();

    // To format dates
    switch(today.getDate().length) {
        case 1:
            var day = `0` + today.getDate();
            break;
        default:
            day = today.getDate();
    }

    switch(today.getMonth().length) {
        case 1:
            var month = `0` + (1 + today.getMonth());
            break;
        default:
            month = 1 + today.getMonth();
    }    

    switch(today.getMinutes().length) {
        case 1:
            var minutes = `0` + today.getMinutes();
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

    // State of waypoint(s)
    const [waypoints, setWaypoints] = useState([]);

    // Create waypoint event handler
    const addWaypoint = () => {
        setWaypoints([...waypoints, <Waypoint dateFrom={dateFrom} dateTo={dateTo} timeFrom={timeFrom} timeTo={timeTo} text={options[0].text} place={options[0].place_name} />]);
        hideModal();
    }

    return (
        <>
            <Container>
                <h1 style={{fontWeight: 'bolder'}} className="mt-2">Create a Trip</h1>
                <hr />
                <Fragment>
                    {waypoints}
                </Fragment>
                <div className="mt-3 mb-3">
                    <Button onClick={showModal}>Add Waypoint</Button>
                </div>
            </Container>
            <WaypointModal 
                show={show} 
                onHide={hideModal} 
                props={{
                    location: location,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    timeFrom: timeFrom,
                    timeTo: timeTo,
                    token: access_token
                }}
                setLocation={setLocation}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                setTimeFrom={setTimeFrom}
                setTimeTo={setTimeTo}
                addWaypoint={addWaypoint}
                handleSearch={handleSearch}
                addTodo={addTodo}
                addTodoCount={addTodoCount}
                removeTodo={removeTodo}
                filterBy={filterBy}
                isLoading={isLoading}
                options={options}
                todoObjects={todoObjects}
            />

        </>
    )
}