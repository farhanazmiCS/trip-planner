import { useEffect, useState } from 'react';
import { Container, Collapse, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// FontAwesome Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faTimes, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';

// To get trip objects, if available
import { trips } from './Profile';
import Waypoint from '../components/Waypoint';

// For Trip component
function getTrip(trips, id) {
    trips = (trips.length !== 0) ? trips.concat(JSON.parse(sessionStorage.getItem('cached_trips'))) : JSON.parse(sessionStorage.getItem('cached_trips'));
    return trips.find(
        trip => trip.id === id
    );
}

export default function Trip(props) {
    // To redirect back 
    const navigate = useNavigate();

    const { myTripInviteRequests, setMyTripInviteRequests, 
    
        titleFieldStyle, setTitleFieldStyle,
        titleField, setTitleField,
        error, setError } = props;

    // Users
    const users = JSON.parse(sessionStorage.getItem('users'));

    // State of collapse
    const [collapse, setCollapse] = useState(false);

    // State of content of friend invite buttons
    const [inviteBtnContent, setInviteBtnContent] = useState([]);

    // State of variant of friend invite buttons
    const [inviteBtnVar, setInviteBtnVar] = useState([]);

    const [inviteBtnClick, setInviteBtnClick] = useState([]);

    // "trips" array is used when viewing the trips for a particular profile. "myTrips" is used for viewing logged user's trips.
    let params = useParams();
    let trip = getTrip(trips, parseInt(params.tripId));

    const [titleEdit, setTitleEdit] = useState(trip.name);

    // To find if the logged on user is in a trip. Concat into the remaining users array.
    const me = trip.users.find(user => user.username === sessionStorage.getItem('username'));
    // Mutate the trip.users to exclude the logged on user, me
    const meIndex = trip.users.findIndex(user => user === me);
    const trip_users_copy = [...trip.users];
    trip_users_copy.splice(meIndex, 1);
    
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
        var buttonProps = toInvite.map((friend, index)  => {
            for (let i = 0; i < myTripInviteRequests.length; i++) {
                if (friend.id === myTripInviteRequests[i].user.id && trip.id === myTripInviteRequests[i].trip.id) {
                    return {
                        content: `${friend.username[0].toUpperCase() + friend.username.slice(1)} invited!`,
                        variant: 'outline-dark',
                        onclick: () => {return;}
                    }
                }
            }
            return {
                content: friend.username[0].toUpperCase() + friend.username.slice(1),
                variant: 'dark',
                onclick: () => inviteFriend(friend, index)
            }
        });
        setInviteBtnVar(buttonProps.map(button => button.variant));
        setInviteBtnContent(buttonProps.map(button => button.content));
        setInviteBtnClick(buttonProps.map(button => button.onclick));
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
                variant: 'outline-dark',
                onclick: () => {return;}
            }
            // Copy
            let inviteBtnVarCopy = [...inviteBtnVar];
            let inviteBtnContentCopy = [...inviteBtnContent];
            let inviteBtnClickCopy = [...inviteBtnClick];
            // Amendments to array
            inviteBtnVarCopy[index] = toSetButtonProp.variant;
            inviteBtnContentCopy[index] = toSetButtonProp.content;
            inviteBtnClickCopy[index] = toSetButtonProp.onclick;
            // Set the array to new properties
            setInviteBtnContent(inviteBtnContentCopy);
            setInviteBtnVar(inviteBtnVarCopy);
            setInviteBtnClick(inviteBtnClickCopy);
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
    /**
     * Function to update the title of a trip that is already saved
     * @return {undefined}
     */
    function updateTitle(e) {
        setTitleEdit(e.target.value);
        setError(null);
    }
    useEffect(initialiseButtons, [toInvite.length, myTripInviteRequests, params.tripId]);
    return (
        <Container key={trip.id}>
            <div className="d-flex justify-content-between" style={{paddingTop: '10px', paddingBottom: '0px'}}>
                <h5 className="pt-2 px-1" style={{textDecoration: 'none', fontSize: '18px'}} onClick={() => navigate(-1)} ><FontAwesomeIcon icon={faChevronLeft} /> Back </h5>
                {/* Invite friends functionality */}
                {!collapse && trip.users.find(user => user.username === sessionStorage.getItem('username')) && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px', color: 'black'}}><FontAwesomeIcon icon={faPlus} /> Add friends to trip</Button>}
                {collapse && <Button onClick={() => setCollapse(!collapse)} aria-controls="my-friends" aria-expanded={collapse} className="py-0" variant="link" style={{textDecoration: 'none', fontSize: '18px', color: 'red'}}><FontAwesomeIcon icon={faTimes} /> Cancel</Button>}
            </div>
            <Collapse in={collapse}>
                <div id="my-friends">
                    <div className="mx-3 mt-3">
                        <h5>Select friends to invite:</h5>
                            {toInvite.map((friend, index) => (
                                <Button className="me-2 mb-2" key={friend.id} onClick={inviteBtnClick[index]} variant={inviteBtnVar[index]} size="sm">{inviteBtnContent[index]}</Button>
                            ))}
                        </div>
                    {toInvite.length === 0 && 
                    <>
                        <p className="m-1 mx-3" style={{color: 'grey', fontSize: '16px'}}>No one to invite to this trip.</p>
                    </>}
                    <h5 className="mt-4 mb-2 mx-3">Who's coming:</h5>
                    {trip.users.length !== 0 && 
                        <div className="mb-2 mx-1">
                            {me &&  
                                <>
                                    <Button 
                                        variant="link"
                                        className="mb-0" 
                                        onClick={() => navigate(`/profile/${me.id}`)}
                                        style={{color: 'grey', fontSize: '16px', textDecoration: 'none'}} 
                                        key={me.username}
                                    >
                                        {1}. Me
                                    </Button>
                                    <br />
                                </>
                            }
                            {trip_users_copy.map((user, index) => (
                                <>
                                    {user.username !== sessionStorage.getItem('username') && 
                                        <>
                                            <Button 
                                                variant="link"
                                                className="mb-0" 
                                                onClick={() => navigate(`/profile/${user.id}`)}
                                                style={{color: 'grey', fontSize: '16px', textDecoration: 'none'}} 
                                                key={user.username}
                                            >
                                                {index + 2}. {user.username[0].toUpperCase() + user.username.slice(1)}
                                            </Button>
                                            <br />
                                        </>
                                    }
                                </>
                            ))}
                        </div>
                    }  
                </div>
            </Collapse>
            <hr />
            <p className="mb-0" style={{textAlign: 'center', color: 'grey'}}>Trip</p>
            {!titleField && titleEdit !== '' && 
                <h1 className="mb-3" style={{fontWeight: 'bolder', textAlign: 'center'}}>{titleEdit} <FontAwesomeIcon style={{fontSize: '20px'}} icon={faPen} onClick={() => setTitleField(true)} /></h1>
            }
            {!titleField && titleEdit === '' && 
                <h1 className="mb-3" style={{fontWeight: 'bolder', textAlign: 'center'}}>{trip.name} <FontAwesomeIcon style={{fontSize: '20px'}} icon={faPen} onClick={() => setTitleField(true)} /></h1>
            }
            {titleField && 
                <Container>
                    <InputGroup className="my-3">
                        <FormControl size="lg" className={titleFieldStyle} aria-describedby="done" style={{display: 'inline-block'}} type="text" value={titleEdit} onChange={updateTitle} />
                        <Button variant="dark" className={titleFieldStyle} id="done" onClick={() => setTitleField(false)}><FontAwesomeIcon icon={faCheck} onClick={() => setTitleField(false)} /></Button>
                    </InputGroup>
                </Container>
            }
            {error && 
                <Container>
                    <Container><p style={{color: 'red'}} className="mb-3">{error}</p></Container>
                </Container>
            }
            {/* Origin */}
            <Waypoint 
                key={(trip.origin.name + trip.origin.detail).toUpperCase() + '1'}
                type={trip.origin.role.toLowerCase()}
                id={0} 
                dateFrom={trip.origin.dateTimeFrom.slice(0, 10)} 
                dateTo={trip.origin.dateTimeTo.slice(0, 10)} 
                timeFrom={trip.origin.dateTimeFrom.slice(12)} 
                timeTo={trip.origin.dateTimeTo.slice(12)} 
                text={trip.origin.name} 
                place={trip.origin.detail}
                todo={trip.origin.todo} 
                me={me}
            />
            {trip.waypoints.map((waypoint, index) => (
                <Waypoint 
                    key={(waypoint.name + waypoint.detail).toUpperCase() + '1'}
                    type={waypoint.role.toLowerCase()}
                    id={index + 1} 
                    dateFrom={waypoint.dateTimeFrom.slice(0, 10)} 
                    dateTo={waypoint.dateTimeTo.slice(0, 10)} 
                    timeFrom={waypoint.dateTimeFrom.slice(12)} 
                    timeTo={waypoint.dateTimeTo.slice(12)} 
                    text={waypoint.name} 
                    place={waypoint.detail}
                    todo={waypoint.todo} 
                    me={me}
                />
            ))}
            <Waypoint 
                key={(trip.destination.name + trip.destination.detail).toUpperCase() + '1'}
                type={trip.destination.role.toLowerCase()}
                id={trip.waypoints.length + 1} 
                dateFrom={trip.destination.dateTimeFrom.slice(0, 10)} 
                dateTo={trip.destination.dateTimeTo.slice(0, 10)} 
                timeFrom={trip.destination.dateTimeFrom.slice(12)} 
                timeTo={trip.destination.dateTimeTo.slice(12)} 
                text={trip.destination.name} 
                place={trip.destination.detail}
                todo={trip.destination.todo} 
                me={me}
            />
        </Container>
    )
}