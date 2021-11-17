import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function Waypoint(props) {
    // Collapse button
    const [collapse, setCollapse] = useState(false);

    // Formats date
    function dateFormatter(date) {
        const monthDict = {
            '1': 'January',
            '2': 'February',
            '3': 'March',
            '4': 'April',
            '5': 'May',
            '6': 'June',
            '7': 'July',
            '8': 'August',
            '9': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        }
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8);

        return `${day} ${monthDict[month]}, ${year}`;
    }
    // Formats time
    function timeFormatter(time) {
        var hours = time.slice(0, 2);
        var minutes = time.slice(3);
        // To determine AM or PM
        if (Number(time.slice(0, 2)) < 12) {
            var ampm = 'AM';
        }
        else if (Number(time.slice(0, 2) > 12)) {
            hours = Number(hours) - 12;
            ampm = 'PM';
        }
        else {
            ampm = 'PM';
        }
        
        return `${hours}:${minutes} ${ampm}`;
    }
    return(
        <Container id={"waypoint-card-" + props.id} className="mb-4">
            <Card bg="dark" text="light" style={{width: '100%' }}>
                {props.id === 0 && 
                    <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold'}}>
                        Origin 
                        <div className="d-flex justify-content-start">
                            <FontAwesomeIcon className="mt-1" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                        </div>
                    </Card.Header>}
                {props.id === props.waypointLength - 1 && 
                    <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold'}}>
                        Destination
                    <div className="d-flex justify-content-start">
                        <FontAwesomeIcon className="mt-1 mx-3" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                        <FontAwesomeIcon className="mt-1" icon={faTimesCircle} style={{color : 'white'}} onClick={() => props.removeWaypoint(props.id)} />
                    </div>
                    </Card.Header>}
                {props.id !== 0 && props.id !== props.waypointLength - 1 && 
                <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold'}}>
                    Stopover {props.id}
                <div className="d-flex justify-content-start">
                    <FontAwesomeIcon className="mt-1 mx-3" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                    <FontAwesomeIcon className="mt-1" icon={faTimesCircle} style={{color : 'white'}} onClick={() => props.removeWaypoint(props.id)} />
                </div>
                </Card.Header>}
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold'}}>{props.text}</Card.Title>
                    <Card.Subtitle style={{color: 'grey'}}>{props.place}</Card.Subtitle>
                    <Card.Text className="mt-2 mb-0">From: {dateFormatter(props.dateFrom)}, {timeFormatter(props.timeFrom)}</Card.Text>
                    <Card.Text className="mb-2">To: {dateFormatter(props.dateTo)}, {timeFormatter(props.timeTo)}</Card.Text>
                    <Collapse in={collapse}>
                        <div id="todo-collapse">
                            {props.todo.length > 0 && <Card.Title style={{fontWeight: 'bold'}}>Todos</Card.Title>}
                            <ol>
                            {props.todo.map(todoItem => (
                                <li>{todoItem.value}</li>
                            ))}
                            </ol>
                        </div>
                    </Collapse>
                    {props.todo.length > 0 && <Container style={{textAlign: 'center'}}>
                        <Button variant="outline-light" onClick={() => setCollapse(!collapse)} aria-controls="todo-collapse" aria-expanded={collapse} size="sm">
                            {collapse === true && 'Hide Todos'}
                            {collapse === false && 'Show Todos'} 
                        </Button>
                    </Container>}
                </Card.Body>
            </Card>
        </Container>
    )
}