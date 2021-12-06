import { Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getTrip } from '../pages/Trips';

// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Trip({myTrips}) {
    let params = useParams();
    let trip = getTrip(myTrips, parseInt(params.tripId))
    return (
        <Container key={trip.id}>
            <div className="d-flex justify-content-between" style={{paddingTop: '10px', paddingBottom: '0px'}}>
                <Link style={{textDecoration: 'none', fontSize: '18px'}} to="/trips" ><FontAwesomeIcon icon={faChevronLeft} /> Back to Trips</Link>
                {/* Invite friends functionality */}
                <Link style={{textDecoration: 'none', fontSize: '18px'}} to="#"><FontAwesomeIcon icon={faPlus} /> Add friends to trip</Link>
            </div>
            <hr />
            <h1 className="mt-2 mb-2" style={{fontWeight: 'bolder', textAlign: 'center'}}>{trip.name}</h1>
            <h6 className="mt-0 mb-1">Who's coming:</h6>
            { trip.users.length !== 0 && 
                <>
                    {trip.users.map(user => (
                        <>
                            {user.username === sessionStorage.getItem('username') && <p style={{fontWeight: 'bold', marginBottom: '20px'}} key={user.username}>Me</p>}
                            {user.username !== sessionStorage.getItem('username') && <p style={{fontWeight: 'bold', marginBottom: '20px'}} key={user.username}>{user.username}</p>}
                        </>
                    ))}
                </>
            }   
            <Container id={trip.origin.role} style={{border: '2px solid black', borderRadius: '10px'}} className="pt-3 pb-3 pl-2 pr-2 mb-3">
                <h4 style={{color: 'green', textAlign: 'center', fontWeight: 'bold'}}>{trip.origin.role}</h4>
                <h3>{trip.origin.name}</h3>
                <h6 style={{color: 'grey'}}>{trip.origin.detail}</h6>
                <div className="dateTimeFrom">
                    <h5>From: </h5>
                    <p>{trip.origin.dateTimeFrom}</p>
                </div>
                <div className="dateTimeTo">
                    <h5>To: </h5>
                    <p>{trip.origin.dateTimeTo}</p>
                </div>
                {trip.origin.todo.length !== 0 && 
                    <>
                        <h5 key={`${trip.origin.role}-todos`} style={{fontWeight: 'bold'}}>Todos at this point:</h5>
                        <ol>
                            {trip.origin.todo.map(t => (
                                <li key={t}>{t}</li>
                            ))}
                        </ol>
                    </>
                }
            </Container>
            {trip.waypoints.map(t => (
                <Container key={`${t.role}-container`} style={{border: '2px solid black', borderRadius: '10px'}} className="pt-3 pb-3 pl-2 pr-2 mb-3 mt-3">
                    <h4 key={t.role} style={{color: 'black', textAlign: 'center', fontWeight: 'bold'}}>{t.role}</h4>
                    <h3 key={t.name}>{t.name}</h3>
                    <h6 key={t.detail} style={{color: 'grey'}}>{t.detail}</h6>
                    <div key={`dateTimeFrom-${t.role}`} className="dateTimeFrom">
                        <h5 key={`dateTimeFrom-placeholder-${t.role}`}>From: </h5>
                        <p key={t.dateTimeFrom}>{t.dateTimeFrom}</p>
                    </div>
                    <div key={`dateTimeTo-${t.role}`} className="dateTimeTo">
                        <h5 key={`dateTimeTo-placeholder-${t.role}`}>To: </h5>
                        <p key={t.dateTimeTo}>{t.dateTimeTo}</p>
                    </div>
                    {t.todo.length !== 0 && 
                        <>
                            <h5 key={`${t.role}-todos`} style={{fontWeight: 'bold'}}>Todos at this point:</h5>
                            <ol>
                                {t.todo.map(t => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ol>
                        </>
                    }
                </Container>
            ))}
            <Container id={trip.destination.role} style={{border: '2px solid black', borderRadius: '10px'}} className="pt-3 pb-3 pl-2 pr-2 mt-3 mb-5">
            <h4 style={{color: 'red', textAlign: 'center', fontWeight: 'bold'}}>{trip.destination.role}</h4>
                <h3>{trip.destination.name}</h3>
                <h6 style={{color: 'grey'}}>{trip.destination.detail}</h6>
                <div className="dateTimeFrom">
                    <h5>From: </h5>
                    <p>{trip.destination.dateTimeFrom}</p>
                </div>
                <div className="dateTimeTo">
                    <h5>To: </h5>
                    <p>{trip.destination.dateTimeTo}</p>
                </div>
                {trip.destination.todo.length !== 0 && 
                    <>
                        <h5 style={{fontWeight: 'bold'}}>Todos at this point:</h5>
                        <ol>
                            {trip.destination.todo.map(t => (
                                <li key={t}>{t}</li>
                            ))}
                        </ol>
                    </>
                }
            </Container>
        </Container>
    )
}