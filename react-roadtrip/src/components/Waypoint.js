import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useState} from 'react';

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
        else {
            hours = Number(hours) - 12;
            ampm = 'PM';
        }
        
        return `${hours}:${minutes} ${ampm}`;
    }
    return(
        <Container id={"waypoint-card-" + props.id} className="mb-4">
            <Card style={{width: '100%' }}>
                {props.id === 0 && <Card.Header style={{color: 'green'}}>Origin</Card.Header>}
                {props.id > 0 && <Card.Header style={{color: 'blue'}}>Stopover {props.id}</Card.Header>}
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
                        <Button variant="outline-secondary" onClick={() => setCollapse(!collapse)} aria-controls="todo-collapse" aria-expanded={collapse}>
                            {collapse === true && 'Hide Todos'}
                            {collapse === false && 'Show Todos'} 
                        </Button>
                    </Container>}
                </Card.Body>
            </Card>
        </Container>
    )
}