import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

// Date and time formatter
import { dateFormatter, timeFormatter } from '../helper';

export default function Waypoint(props) {
    // Collapse button
    const [collapse, setCollapse] = useState(false);
    return(
        <div id={"waypoint-card-" + props.id} className="mb-3">
            <Card bg="dark" text="light" style={{width: '100%' }}>
                {props.type === 'origin' && 
                    <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                        Origin
                        {props.me && 
                            <div className="d-flex justify-content-start">
                                <FontAwesomeIcon className="mt-1" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                            </div>
                        } 
                    </Card.Header>}
                {props.type.includes('stopover') && 
                    <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                        Stopover {props.id}
                        {props.me &&
                            <div className="d-flex justify-content-start">
                                <FontAwesomeIcon className="mt-1 mx-3" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                                <FontAwesomeIcon className="mt-1" icon={faTimesCircle} style={{color : 'white'}} onClick={() => props.removeWaypoint(props.id)} />
                            </div>
                        }
                    </Card.Header>}
                {props.type === 'destination' && 
                    <Card.Header className="d-flex justify-content-between" style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                        Destination
                        {props.me && 
                            <div className="d-flex justify-content-start">
                                <FontAwesomeIcon className="mt-1" icon={faPen} style={{color : 'white'}} onClick={() => props.editWaypoint(props.id)} />
                            </div>
                        }
                    </Card.Header>}
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold'}}>{props.text}</Card.Title>
                    <Card.Subtitle style={{color: 'grey'}}>{props.place}</Card.Subtitle>
                    <Card.Text className="mt-2 mb-0" style={{fontWeight: 'bolder', fontSize: '18px'}}>From</Card.Text>
                    <Card.Text className="mb-1">{dateFormatter(props.dateFrom)}, {timeFormatter(props.timeFrom)}</Card.Text>
                    <Card.Text className="mt-2 mb-0" style={{fontWeight: 'bolder', fontSize: '18px'}}>To</Card.Text>
                    <Card.Text>{dateFormatter(props.dateTo)}, {timeFormatter(props.timeTo)}</Card.Text>
                    <Collapse in={collapse}>
                        <div id="todo-collapse">
                            {props.todo.length > 0 && <Card.Title style={{fontWeight: 'bold'}}>Todos</Card.Title>}
                            <ol style={{paddingLeft: '18px'}}>
                            {props.todo.map((todoItem, index) => (
                                <li key={index}>{todoItem}</li>
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
        </div>
    )
}