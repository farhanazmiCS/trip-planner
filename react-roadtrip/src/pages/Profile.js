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

// All of the profile's trips
export var trips = [];

export default function Profile(props) {
    // State of isRequested
    const [isRequested, setIsRequested] = useState(false);
    // State of "Add Friend" button
    const [buttonVariant, setButtonVariant] = useState('dark');
    const [buttonContent, setButtonContent] = useState('Add Friend');

    const [profileTrips, setProfileTrips] = useState([]);
    
    // Get profile data
    const username = sessionStorage.getItem('username');
    let params = useParams();
    let profile = getUser(JSON.parse(sessionStorage.getItem('users')), parseInt(params.userId));
    
    // Returns an array, if the 'friends' array includes the logged on user's username
    const friends = profile.friends.map(friend => friend.username === sessionStorage.getItem('username'));

    // When isRequested changes (with the click of the 'Add Friend' button),
    // This script will run. 
    useEffect(() => {
        const url = 'http://127.0.0.1:8000/notifications/my_requests_friends';
        const request = new Request(url, {
            'headers': {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
            }
        })
        fetch(request)
        .then(res => res.json())
        .then(body => {
            const myFriendRequests = body.map(m => {
                return {
                    user: {
                      id: m.to.id,
                      username: m.to.username
                    }
                }
            })
            props.setMyFriendRequests(myFriendRequests)
            sessionStorage.setItem('my_friend_requests', JSON.stringify(myFriendRequests))
        })
        .then(() => {
            // If check returns undefined, no requests are made to this user.
            if (props.myFriendRequests.length === 0) {
                var friend_requests = JSON.parse(sessionStorage.getItem('my_friend_requests'));
                var check = friend_requests.find(fr => fr.user.username === profile.username);
            }
            else {
                check = props.myFriendRequests.find(fr => fr.user.username === profile.username);
            }
            if (check !== undefined) {
                setIsRequested(true);
                setButtonVariant('outline-dark');
                setButtonContent('Requested');
            }
            else {
                setIsRequested(false);
                setButtonVariant('dark');
                setButtonContent('Add Friend');
            }
        })
    }, [isRequested, params.userId])
    
    useEffect(() => {
        if (friends.find(friend => friend) === undefined) return;
        else {
            let profileTripsUrl = `http://127.0.0.1:8000/trips/${profile.id}/list_other_trip`;
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
                // To export
                trips = [...trip];
                const cached_trips = JSON.parse(sessionStorage.getItem('cached_trips'));
                cached_trips.concat(trip);
                sessionStorage.setItem('cached_trips', JSON.stringify(cached_trips));
            })
        }
    }, [props, profile.id, props.users]);

    // Add Friend button handler
    function addFriend() {
        let url = 'http://127.0.0.1:8000/notifications/send_request/';
        let request = new Request(url, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(username)}`
            }
        });
        fetch(request, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                toAddUsername: profile.username,
                is_addFriend: 'True'
            })
        })
        .then(res => res.status)
        .then(status => {
            if (status === 200) {
                setIsRequested(true);
            }
        })
        .catch(error => console.log(error));
    }

    // Remove Friend
    function unFriend(user) {
        let url = `http://127.0.0.1:8000/users/${user.id}/remove_friend/`;
        let request = new Request(url, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
            }
        })
        fetch(request, {
            method: 'DELETE'
        })
        .then(() => {
            let urlUpdateUsers = 'http://127.0.0.1:8000/users';
            let requestUpdateUsers = new Request(urlUpdateUsers);
            fetch(requestUpdateUsers)
            .then(res => res.json())
            .then(body => {
                const users = body.map(user => user)
                props.setUsers(users);
                sessionStorage.setItem('users', JSON.stringify(users));
            })
        })
        .catch(error => console.log(error));
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
                    {/* If friend request is sent */}
                    {isRequested && 
                        <>
                            <div className="row">
                                <Container className="d-grid gap-2 mt-3">
                                    <Button variant={buttonVariant}>{buttonContent}</Button>
                                </Container>
                            </div>
                            <hr />
                            <div className="row">
                                <h1 style={{textAlign: 'center'}}><FontAwesomeIcon icon={faLock} style={{textAlign: 'center'}} /></h1>
                                <h3 style={{textAlign: 'center'}}>This profile is private.</h3>
                            </div>
                        </>
                    }
                    {/* If friend request is NOT sent, not a friend of the logged user */}
                    {friends.find(friend => friend) === undefined && !isRequested && 
                        <>
                            <div className="row">
                                <Container className="d-grid gap-2 mt-3">
                                    <Button onClick={addFriend} variant={buttonVariant}>{buttonContent}</Button>
                                </Container>
                            </div>
                            <hr />
                            <div className="row mt-5">
                                <h1 style={{textAlign: 'center'}}><FontAwesomeIcon icon={faLock} style={{textAlign: 'center'}} /></h1>
                                <h3 style={{textAlign: 'center'}}>This profile is private.</h3>
                            </div>
                        </>
                    }
                    {/* Is a friend of logged user */}
                    {friends.find(friend => friend) === true && 
                        <>
                            <div className="row">
                                <Container className="d-grid gap-2 mt-3">
                                    <Button onClick={() => unFriend(profile)} variant="outline-dark">Unfriend</Button>
                                </Container>
                            </div>
                            <hr />
                            <Container className="d-grid gap-2 mb-2">
                                <h3 style={{fontWeight: 'bolder'}}>{profile.username[0].toUpperCase() + profile.username.slice(1)}'s Trips</h3>
                            </Container>
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
                            {profileTrips.length === 0 && 
                                <Container className="d-grid gap-2 mt-5">
                                    <h2 style={{textAlign: 'center', color: 'grey'}}>No Trips :/</h2>
                                </Container>
                            }
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
                    <Container className="mb-3">
                        <h3 style={{fontWeight: 'bolder'}}>Your Trips</h3>
                    </Container>
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