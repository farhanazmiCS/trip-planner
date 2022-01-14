import { useEffect, useState } from 'react';
import { Container, Collapse, Button, Card } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';

// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

// To get trip objects, if available
import { trips } from './Profile';

// For Trip component
function getTrip(trips, id) {
    trips = (trips.length !== 0) ? trips.concat(JSON.parse(sessionStorage.getItem('cached_trips'))) : JSON.parse(sessionStorage.getItem('cached_trips'));
    return trips.find(
        trip => trip.id === id
    );
}

export default function Trip({ myTripInviteRequests, setMyTripInviteRequests }) {
    // To redirect back 
    const navigate = useNavigate();
   
    // Users
    const users = JSON.parse(sessionStorage.getItem('users'));

    // State of collapse
    const [collapse, setCollapse] = useState(false);

    // State of content of friend invite buttons
    const [inviteBtnContent, setInviteBtnContent] = useState([]);

    // State of variant of friend invite buttons
    const [inviteBtnVar, setInviteBtnVar] = useState([]);

    // "trips" array is used when viewing the trips for a particular profile. "myTrips" is used for viewing logged user's trips.
    let params = useParams();
    let trip = getTrip(trips, parseInt(params.tripId));
    
    // Retrieve the user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === sessionStorage.getItem('username')) var user = users[i];
    }
    // Friends that are yet to be invited
    var toInvite = [...user.friends];
    // Iterate through the user's friends list
    for (let i = 0; i < toInvite.length; i++) {
        // For every friend, check if that friend is in the trip.
        if (trip.users.find(user => toInvite[i].username === user.username) !== undefined) {
            toInvite[i] = undefined;
        }
    }
    // Places all 'undefined' elements to the back to remove them
    toInvite.sort();
    // Remove all undefined elements
    const indexToSplice = toInvite.findIndex(item => item === undefined);
    // When no elements in toInvite is undefined, indexToSplice will be set to -1 (A property of js :/).
    // Hence, only splice when it is not -1.
    if (indexToSplice !== -1) {
        toInvite.splice(indexToSplice);
    }

    function initialiseButtons() {
        var buttonProps = toInvite.map(friend => {
            for (let i = 0; i < myTripInviteRequests.length; i++) {
                if (friend.id === myTripInviteRequests[i].user.id && trip.id === myTripInviteRequests[i].trip.id) {
                    return {
                        content: `${friend.username[0].toUpperCase() + friend.username.slice(1)} invited!`,
                        variant: 'outline-dark'
                    }
                }
            }
            return {
                content: friend.username[0].toUpperCase() + friend.username.slice(1),
                variant: 'dark'
            }
        });
        setInviteBtnVar(buttonProps.map(button => button.variant));
        setInviteBtnContent(buttonProps.map(button => button.content));
    }
    // Function to invite friends to the trip
    function inviteFriend(friend, index) {
        let url = `http://127.0.0.1:8000/notifications/send_request/`;
        let request = new Request(url, {
            'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
        })
        fetch(request, {
            method: 'POST',
            body: JSON.stringify({
                username: sessionStorage.getItem('username'),
                toAddUsername: friend.username,
                is_inviteToTrip: 'True',
                trip: trip.id
            })
        })
        .then(() => {
            const toSetButtonProp = {
                content: `${friend.username[0].toUpperCase() + friend.username.slice(1)} invited!`,
                variant: 'outline-dark'
            }
            // Copy
            let inviteBtnVarCopy = [...inviteBtnVar];
            let inviteBtnContentCopy = [...inviteBtnContent];
            // Amendments to array
            inviteBtnVarCopy[index] = toSetButtonProp.variant
            inviteBtnContentCopy[index] = toSetButtonProp.content
            // Set the array to new properties
            setInviteBtnContent(inviteBtnContentCopy);
            setInviteBtnVar(inviteBtnVarCopy);
        })
        .then(() => {
            const url = 'http://127.0.0.1:8000/notifications/my_requests_trips';
            const request = new Request(url, {
                headers: {
                    'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
                }
            })
            fetch(request)
            .then(res => res.json())
            .then(body => {
                const myTripRequests = body.map(m => {
                    return {
                        user: {
                            id: m.to.id,
                            username: m.to.username,
                        },
                        trip: {
                            id: m.trip.id
                        }
                    }
                })
                setMyTripInviteRequests(myTripRequests);
                sessionStorage.setItem('my_trip_requests', JSON.stringify(myTripRequests));
            })
        })
        .catch(error => console.log(error));
    }
    useEffect(initialiseButtons, [toInvite.length, myTripInviteRequests, params.tripId]);
    return (
        <Container key={trip.id}>
            <div className="d-flex justify-content-between" style={{paddingTop: '10px', paddingBottom: '0px'}}>
                <h5 className="pt-2" style={{textDecoration: 'none', fontSize: '18px'}} onClick={() => navigate(-1)} ><FontAwesomeIcon icon={faChevronLeft} /> Back to Trips</h5>
                {/* Invite friends functionality */}
                {!collapse && trip.users.find(user => user.username === sessionStorage.getItem('username')) && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px', color: 'black'}}><FontAwesomeIcon icon={faPlus} /> Add friends to trip</Button>}
                {collapse && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px', color: 'red'}}><FontAwesomeIcon icon={faTimes} /> Cancel</Button>}
            </div>
            <Collapse in={collapse}>
                <div id="my-friends">
                    <h6 className="m-1">Select friends to invite:</h6>
                    {toInvite.map((friend, index) => (
                        <Button key={friend.id} onClick={() => inviteFriend(friend, index)} className="m-1" variant={inviteBtnVar[index]} size="sm">{inviteBtnContent[index]}</Button>
                    ))}
                    {toInvite.length === 0 && 
                    <>
                        <p className="m-1" style={{color: 'grey', fontSize: '16px'}}>No one to invite to this trip.</p>
                    </>}
                </div>
            </Collapse>
            <hr />
            <h1 className="mt-2 mb-2" style={{fontWeight: 'bolder', textAlign: 'center'}}>{trip.name}</h1>
            <h6 className="mt-0 mb-1">Who's coming:</h6>
            {trip.users.length !== 0 && 
                <>
                    {trip.users.map(user => (
                        <>
                            {user.username === sessionStorage.getItem('username') && <p style={{fontWeight: 'bold', marginBottom: '20px'}} key={user.username}>Me</p>}
                            {user.username !== sessionStorage.getItem('username') && <p style={{fontWeight: 'bold', marginBottom: '20px'}} key={user.username}>{user.username[0].toUpperCase() + user.username.slice(1)}</p>}
                        </>
                    ))}
                </>
            }   
            <Container id={trip.origin.role} className="mb-3">
                <Card bg="dark" text="light" style={{width: '100%'}}>
                    <Card.Header style={{textAlign: 'center', fontWeight: 'bold', fontSize: '24px'}}>
                        {trip.origin.role}
                    </Card.Header>
                    <Card.Body>
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
                    </Card.Body>
                    </Card>
            </Container>
            {trip.waypoints.map(t => (
                <Container id={t.role} className="mb-3">
                    <Card bg="dark" text="light" style={{width: '100%'}}>
                        <Card.Header style={{textAlign: 'center', fontWeight: 'bold', fontSize: '24px'}}>
                            {t.role}
                        </Card.Header>
                        <Card.Body>
                            <h3 key={`${t.name}-header`}>{t.name}</h3>
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
                        </Card.Body>
                    </Card>
                </Container>
            ))}
            <Container id={trip.destination.role} className="mb-3">
                <Card bg="dark" text="light" style={{width: '100%'}}>
                    <Card.Header style={{textAlign: 'center', fontWeight: 'bold', fontSize: '24px'}}>
                        {trip.destination.role}
                    </Card.Header>
                    <Card.Body>
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
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    )
}