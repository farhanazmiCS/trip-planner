import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

export default function Waypoint(props) {
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
        <Container className="mb-4">
            <Card style={{width: '100%' }}>
                <Card.Header style={{color: 'green'}}>Origin</Card.Header>
                <Card.Body>
                    <Card.Title>{props.text}</Card.Title>
                    <Card.Subtitle style={{color: 'grey'}}>{props.place}</Card.Subtitle>
                    <p>From {dateFormatter(props.dateFrom)}, {timeFormatter(props.timeFrom)}</p>
                    <p>To {dateFormatter(props.dateTo)}, {timeFormatter(props.timeTo)}</p>

                </Card.Body>
            </Card>
        </Container>
    )
}