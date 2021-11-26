import Container from 'react-bootstrap/Container';

export default function ViewTrip(props) {
    return (
        <>
            <Container>
                <h1 style={{fontWeight: 'bolder'}} className="mt-2">My Trips</h1>
                <hr />
                {props.myTrips.map(trip => (
                    <Container key={trip.name}>
                        <h1>{trip.name}</h1>
                        <h3>Origin</h3>
                        <p>{trip.origin.name}</p>
                        <p>{trip.origin.dateTimeFrom}</p>
                        <p>{trip.origin.dateTimeTo}</p>
                        <h5>Todos</h5>
                        {trip.origin.todo.map(t => <li>{t}</li>)}
                        {trip.waypoints.map((waypoint, index) => (
                            <>
                                <h3>Stopover {index + 1}</h3>
                                <p>{waypoint.name}</p>
                                <p>{waypoint.dateTimeFrom}</p>
                                <p>{waypoint.dateTimeTo}</p>
                                <h5>Todos</h5>
                                {waypoint.todo.map(t => <li>{t}</li>)}
                            </>
                        ))}
                        <h3>Destination</h3>
                        <p>{trip.destination.name}</p>
                        <p>{trip.destination.dateTimeFrom}</p>
                        <p>{trip.destination.dateTimeTo}</p>
                        <h5>Todos</h5>
                        {trip.destination.todo.map(t => <li>{t}</li>)}
                        <hr />
                    </Container>
                ))}
            </Container>
        </>
    )
}