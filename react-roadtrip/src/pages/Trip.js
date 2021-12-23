import { useEffect, useState } from 'react';
import { Container, Collapse, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getTrip } from '../pages/Trips';
// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Trip({ myTrips, users, myTripInviteRequests, setMyTripInviteRequests }) {
    // State of collapse
    const [collapse, setCollapse] = useState(false);
    // State of content of friend invite buttons
    const [inviteBtnContent, setInviteBtnContent] = useState([]);
    // State of variant of friend invite buttons
    const [inviteBtnVar, setInviteBtnVar] = useState([]);
    let params = useParams();
    let trip = getTrip(myTrips, parseInt(params.tripId))
    // Retrieve the user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === sessionStorage.getItem('username')) var user = users[i];
    }
    // Friends that are yet to be invited
    var toInvite = [...user.friends];
    toInvite.forEach((friend, index) => {
        trip.users.find(user => {
            if (user.id === friend.id) {
                toInvite.splice(index, 1);
            }
        })
    })
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
        let url = `http://127.0.0.1:8000/api/savenotification`;
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
                content: `Invite sent to ${friend.username[0].toUpperCase() + friend.username.slice(1)}!`,
                variant: 'outline-dark'
            }
            // Copy
            const inviteBtnVarCopy = [...inviteBtnVar];
            const inviteBtnContentCopy = [...inviteBtnContent];
            // Amendments to array
            inviteBtnVarCopy.splice(index, 1, toSetButtonProp.variant);
            inviteBtnContentCopy.splice(index, 1, toSetButtonProp.content);
            // Set the array to new properties
            setInviteBtnContent(inviteBtnContentCopy);
            setInviteBtnVar(inviteBtnVarCopy);
        })
        .catch(error => console.log(error));
    }
    useEffect(initialiseButtons, [user.friends, myTripInviteRequests, trip.id]);
    return (
        <Container key={trip.id}>
            <div className="d-flex justify-content-between" style={{paddingTop: '10px', paddingBottom: '0px'}}>
                <Link style={{textDecoration: 'none', fontSize: '18px'}} to="/trips" ><FontAwesomeIcon icon={faChevronLeft} /> Back to Trips</Link>
                {/* Invite friends functionality */}
                {!collapse && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px'}}><FontAwesomeIcon icon={faPlus} /> Add friends to trip</Button>}
                {collapse && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px', color: 'red'}}><FontAwesomeIcon icon={faTimes} /> Cancel</Button>}
            </div>
            <Collapse in={collapse}>
                <div id="my-friends">
                    <h6 className="m-1">Select friends to invite:</h6>
                    {toInvite.map((friend, index) => (
                        <Button key={friend.id} onClick={() => inviteFriend(friend, index)} className="m-1" variant={inviteBtnVar[index]} size="sm">{inviteBtnContent[index]}</Button>
                    ))}
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