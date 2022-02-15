import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Container, Card } from "react-bootstrap";

export default function Notifications(props) {
    var friendRequestCopy = [...props.friendRequests];
    var tripRequestCopy = [...props.tripRequests];
    // Function to accept/decline request
    function acceptFriendRequest(request, index) {
        // Find the user objects of accepter and requester
        let accepter = props.users.find(user => user.username === request.to.username);
        let requester = props.users.find(user => user.username === request.frm.username);
        // Url endpoints for amending accepter and requester friends list
        let urlAccepter = `http://127.0.0.1:8000/users/${accepter.id}/add_friend/`;
        let urlRequester = `http://127.0.0.1:8000/users/${requester.id}/add_friend/`;
        // Url endpoint for deleting the notification
        let urlDeleteNotification = `http://127.0.0.1:8000/notifications/${request.id}/delete_notification/`;
        // Initialising new Requests
        let requestAddFriendToAccepterFriendList = new Request(urlAccepter, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        });
        let requestAddFriendToRequesterFriendList = new Request(urlRequester, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        })
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        });
        // Fetching
        let addToAccepter = fetch(requestAddFriendToAccepterFriendList, {
            method: 'PUT',
            body: JSON.stringify({
                'friend': requester
            })
        })
        let addtoRequester = fetch(requestAddFriendToRequesterFriendList, {
            method: 'PUT',
            body: JSON.stringify({
                'friend': accepter
            })
        })
        // After amending the 'friends' array for both the requester and accepter, DELETE the notification object.
        Promise.all([addToAccepter, addtoRequester]).then(
            fetch(deleteNotificationObjectAfterAction, {
                method: 'DELETE'
            })
        )
        .then(() => {
            let urlUpdateUsers = 'http://127.0.0.1:8000/users';
            let requestUpdateUsers = new Request(urlUpdateUsers);
            fetch(requestUpdateUsers)
            .then(res => res.json())
            .then(body => {
                props.setUsers(body);
                return body;
            })
            .then(users => {
                sessionStorage.setItem('users', JSON.stringify(users));
            })
        })
        .catch(error => console.log(error));
        friendRequestCopy.splice(index, 1);
        props.setFriendRequests(friendRequestCopy);
    }
    function declineFriendRequest(request, index) {
        // For declining friend request, simply delete the notification object.
        let urlDeleteNotification = `http://127.0.0.1:8000/notifications/${request.id}/delete_notification/`;
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        });
        fetch(deleteNotificationObjectAfterAction, {
            method: 'DELETE'
        })
        .catch(error => console.log(error));
        friendRequestCopy.splice(index, 1)
        props.setFriendRequests(friendRequestCopy);
    }
    function acceptTripRequest(request, index) {
        // To add user in the trip object
        let url = `http://127.0.0.1:8000/trips/${request.trip.id}/add_friend_to_trip/`;
        let addUserToTrip = new Request(url, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`
            }
        })
        // To delete the notification object
        let urlDeleteNotification = `http://127.0.0.1:8000/notifications/${request.id}/delete_notification/`;
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        });
        // To update the user count, set the users array
        let urlFetchUser = `http://127.0.0.1:8000/users`;
        let fetchUserRequest = new Request(urlFetchUser, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        })
        // To update myTrips
        let urlFetchTrips = `http://127.0.0.1:8000/trips`;
        let fetchTripsRequest = new Request(urlFetchTrips, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        })
        // Operation to insert the user's object into the users list in the trip object
        fetch(addUserToTrip, {
            method: 'PUT'
        })
        // Delete notification object, remove from the state array
        .then(() => {
            fetch(deleteNotificationObjectAfterAction, {
                method: 'DELETE'
            });
            tripRequestCopy.splice(index, 1);
            // Update trip requests array, to remove the notification object
            props.setTripRequests(tripRequestCopy);
        })
        // Set users
        .then(() => {
            fetch(fetchUserRequest).then(res => res.json()).then(body => props.setUsers(body));
        })
        // Set trips
        .then(() => {
            fetch(fetchTripsRequest).then(res => res.json()).then(body => {
                const trips = body.map(t => {
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
                })
                props.setMyTrips(trips);
                props.setTripCounter(trips.length);
            });
        })
    }
    function declineTripRequest(request, index) {
        let urlDeleteNotification = `http://127.0.0.1:8000/notifications/${request.id}/delete_notification/`;
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
            }
        });
        fetch(deleteNotificationObjectAfterAction, {
            method: 'DELETE'
        })
        .catch(error => console.log(error));
        tripRequestCopy.splice(index, 1);
        props.setTripRequests(tripRequestCopy);
    }
    return (
        <Container>
            <Container>
                <h1 className="mt-2" style={{fontWeight: 'bolder', textAlign: 'center'}}>Notifications</h1>
                <hr className="mb-3 mt-0" />
            </Container>
            {props.friendRequests.map((request, index) => (
                <Container className="mt-1" key={request.id}>
                    <h3 className="mt-0 mb-1" style={{fontWeight: 'bold'}}>Friend Request</h3>
                    <p style={{color: 'grey', fontSize: '18px'}}>{request.frm.username[0].toUpperCase() + request.frm.username.slice(1)} would like to add you as a friend.</p>
                    <div style={{textAlign: 'right'}}>
                        <ButtonGroup aria-label="accept-reject">
                            <Button onClick={() => acceptFriendRequest(request, index)} variant="dark"><FontAwesomeIcon icon={faCheck} /> Accept</Button>
                            <Button onClick={() => declineFriendRequest(request, index)} variant="danger"><FontAwesomeIcon icon={faTimes} /> Decline</Button>
                        </ButtonGroup>
                    </div>
                    <hr />
                </Container>
            ))}
            {props.tripRequests.map((request, index) => (
                <Container className="mt-1" key={request.id}>
                    <h3 className="mt-0 mb-1" style={{fontWeight: 'bold'}}>Trip Invite</h3>
                    <p className="mb-2" style={{color: 'grey', fontSize: '18px'}}>{request.frm.username[0].toUpperCase() + request.frm.username.slice(1)} would like to invite you to a trip.</p>
                    <Card bg="dark" text="light" className="mb-3">
                        <Card.Body>
                            <Card.Title style={{fontSize: '24px'}}>{request.trip.name}</Card.Title>
                            <Card.Text style={{fontSize: '18px'}}>From {request.trip.origin.text} to {request.trip.destination.text}</Card.Text>
                        </Card.Body>
                    </Card>
                    <div style={{textAlign: 'right'}}>
                        <ButtonGroup aria-label="accept-reject">
                            <Button onClick={() => acceptTripRequest(request, index)} variant="dark"><FontAwesomeIcon icon={faCheck} /> Accept</Button>
                            <Button onClick={() => declineTripRequest(request, index)} variant="danger"><FontAwesomeIcon icon={faTimes} /> Decline</Button>
                        </ButtonGroup>
                    </div>
                    <hr />
                </Container>
            ))}
            {props.tripRequests.length === 0 && props.friendRequests.length === 0 && 
            <>
                <Container>
                    <h1 className="mt-5" style={{textAlign: 'center', color: 'grey'}}>No new notifications :/</h1>
                </Container>
            </>}
        </Container>
    )
}