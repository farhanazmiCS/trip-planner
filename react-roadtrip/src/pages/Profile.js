import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function getUser(users, id) {
    return (
        users.find(user => user.id === id)
    )
}

export default function Profile(props) {
    // State of "Add Friend" button
    const [buttonVariant, setButtonVariant] = useState('dark');
    const [buttonContent, setButtonContent] = useState('Add Friend');

    const [profileTrips, setProfileTrips] = useState([]);
    
    // Get profile data
    const username = sessionStorage.getItem('username');
    let params = useParams();
    let profile = getUser(props.users, parseInt(params.userId));
    
    // Returns an array, if the 'friends' array includes the logged on user's username
    const friends = profile.friends.map(friend => friend.username === sessionStorage.getItem('username'));
    
    // For loop to check if this profile has a friend request sent
    for (let i = 0; i < props.myFriendRequests.length; i++) {
        if (profile.username === props.myFriendRequests[i].user.username) {
            var is_requested = true;
        }
        else {
            is_requested = false;
        }
    }
    useEffect(() => {
        if (friends === undefined) return;
        else {
            let profileTripsUrl = `http://127.0.0.1:8000/api/trips/${profile.id}`;
            let requestProfileTrips = new Request(profileTripsUrl, {
                headers: {
                    'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
                }
            })
            fetch(requestProfileTrips)
            .then(response => response.json())
            .then(body => {
                const trip = body.map(t => {
                    return {
                        id: t.id,
                        name: t.name,
                        origin: {
                            role: 'Origin',
                            name: t.origin.text,
                            detail: t.origin.place_name,
                            longitude: t.origin.longitude,
                            latitude: t.origin.latitude,
                            dateTimeFrom: props.formatDateTime(t.origin.dateTimeFrom),
                            dateTimeTo: props.formatDateTime(t.origin.dateTimeTo),
                            todo: t.origin.todo.map(t => t.task)
                        },
                        destination: {
                            role: 'Destination',
                            name: t.destination.text,
                            detail: t.destination.place_name,
                            longitude: t.destination.longitude,
                            latitude: t.destination.latitude,
                            dateTimeFrom: props.formatDateTime(t.destination.dateTimeFrom),
                            dateTimeTo: props.formatDateTime(t.destination.dateTimeTo),
                            todo: t.destination.todo.map(t => t.task)
                        },
                        waypoints: t.waypoint.map((w, index) => {
                            return {
                                id: w.id,
                                role: `Stopover ${index + 1}`,
                                name: w.text,
                                detail: w.place_name,
                                longitude: w.longitude,
                                latitude: w.latitude,
                                dateTimeFrom: props.formatDateTime(w.dateTimeFrom),
                                dateTimeTo: props.formatDateTime(w.dateTimeTo),
                                todo: w.todo.map(t => t.task)
                            }
                        }),
                        users: t.users.map(user => {
                            return {
                                id: user.id,
                                username: user.username,
                                email: user.email
                            }
                        })
                    }
                });
                setProfileTrips(trip);
            })
        }
    }, [props, profile.id])
    // Add Friend button handler
    function addFriend(e) {
        let url = 'http://127.0.0.1:8000/api/savenotification';
        let request = new Request(url, {
            'headers': {
                'X-CSRFToken': props.token,
                'Authorization': `Token ${sessionStorage.getItem(username)}`
            }
        });
        fetch(request, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                toAddUsername: profile.username.toLowerCase(),
                is_addFriend: 'True'
            })
        })
        .then(res => res.status)
        .then(status => {
            if (status === 200) {
                setButtonContent('Requested');
                setButtonVariant('outline-dark');
            }
        })
        .catch(error => console.log(error));
        e.preventDefault();
    }
    // Remove Friend
    function removeFriend(e) {
        // Todo
    }
    // Viewing other profiles
    if (profile.username !== sessionStorage.getItem('username')) {
        return (
            <Container>
                <Container>
                    <div className="row mt-3">
                        <h1 style={{textAlign: 'center'}}>{profile.username}</h1>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Trips</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Friends</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.tripCounter}</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.friendCounter}</h4>
                        </div>
                    </div>
                    {is_requested && 
                        <>
                            <div className="row">
                                <Button variant="outline-dark">Requested</Button>
                            </div>
                            <hr />
                            <div className="row">
                                <h1 style={{textAlign: 'center'}}><FontAwesomeIcon icon={faLock} style={{textAlign: 'center'}} /></h1>
                                <h3 style={{textAlign: 'center'}}>This profile is private.</h3>
                            </div>
                        </>
                    }
                    {!friends[0] && !is_requested && 
                        <>
                            <div className="row">
                                <Button onClick={addFriend} variant={buttonVariant}>{buttonContent}</Button>
                            </div>
                            <hr />
                            <div className="row">
                                <h1 style={{textAlign: 'center'}}><FontAwesomeIcon icon={faLock} style={{textAlign: 'center'}} /></h1>
                                <h3 style={{textAlign: 'center'}}>This profile is private.</h3>
                            </div>
                        </>
                    }
                    {friends[0] && 
                        <>
                            <div className="row">
                                <Button variant="outline-dark">Unfriend</Button>
                            </div>
                            <hr />
                            {profileTrips.map(trip => (
                                <Link style={{textDecoration: 'none'}} to={`/trips/${trip.id}`} key={trip.id}>
                                    <Container key={`trips-${trip.id}`} className="d-grid gap-2">
                                        <Button key={'button-' + trip.id} className="mb-2" variant="outline-dark" style={{textAlign: 'left'}}>
                                            <h3 key={trip.name}>{trip.name}</h3>
                                            <p key={trip.origin.name + '-' + trip.destination.name} className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                                        </Button>
                                    </Container>
                                </Link>
                            ))}
                        </>
                    }
                </Container>
            </Container>
        )
    }
    // Logged user's profile
    else {
        return (
            <Container>
                <Container>
                    <div className="row mt-3">
                        <h1 style={{textAlign: 'center'}}>{profile.username}</h1>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Trips</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center', fontWeight: '300'}}>Friends</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.tripCounter}</h4>
                        </div>
                        <div className="col">
                            <h4 style={{textAlign: 'center'}}>{profile.friendCounter}</h4>
                        </div>
                    </div>
                    <hr />
                    {props.myTrips.map(trip => (
                        <Link style={{textDecoration: 'none'}} to={`/trips/${trip.id}`} key={trip.id}>
                            <Container key={`trips-${trip.id}`} className="d-grid gap-2">
                                <Button key={'button-' + trip.id} className="mb-2" variant="outline-dark" style={{textAlign: 'left'}}>
                                    <h3 key={trip.name}>{trip.name}</h3>
                                    <p key={trip.origin.name + '-' + trip.destination.name} className="mb-1" style={{fontSize: '16px', color: 'grey', display: 'inline-block'}}>Trip from {trip.origin.name} to {trip.destination.name}</p>
                                </Button>
                            </Container>
                        </Link>
                    ))}
                </Container>
            </Container>
        )
    }
}