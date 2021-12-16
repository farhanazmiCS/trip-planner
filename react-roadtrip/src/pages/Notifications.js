import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Container } from "react-bootstrap";

export default function Notifications({friendRequests, setFriendRequests, tripRequests, users, setUsers, csrftoken}) {
    var friendRequestCopy = [...friendRequests];
    // Function to accept/decline request
    function acceptFriendRequest(request) {
        // Find the user objects of accepter and requester
        let accepter = users.find(user => user.username === request.to.username);
        let requester = users.find(user => user.username === request.frm.username);
        // Url endpoints for amending accepter and requester friends list
        let urlAccepter = `http://127.0.0.1:8000/api/updateuser/${accepter.id}`;
        let urlRequester = `http://127.0.0.1:8000/api/updateuser/${requester.id}`;
        // Url endpoint for deleting the notification
        let urlDeleteNotification = `http://127.0.0.1:8000/api/deletenotification/${request.id}`;
        // Initialising new Requests
        let requestAddFriendToAccepterFriendList = new Request(urlAccepter, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
                'X-CSRFToken': csrftoken
            }
        });
        let requestAddFriendToRequesterFriendList = new Request(urlRequester, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
                'X-CSRFToken': csrftoken
            }
        })
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
                'X-CSRFToken': csrftoken
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
            let urlUpdateUsers = 'http://127.0.0.1:8000/api/users';
            let requestUpdateUsers = new Request(urlUpdateUsers);
            fetch(requestUpdateUsers)
            .then(res => res.json())
            .then(body => {
                const users = body.map(user => user)
                setUsers(users);
            })
        })
        .catch(error => console.log(error));
        // Get index of the notification to delete
        for (let i = 0; i < friendRequests.length; i++) {
            if (friendRequests[i].id === request.id) {
                var index = i;
            }
        }
        friendRequestCopy.splice(index, 1);
        setFriendRequests(friendRequestCopy);
    }
    function declineFriendRequest(request) {
        // For declining friend request, simply delete the notification object.
        let urlDeleteNotification = `http://127.0.0.1:8000/api/deletenotification/${request.id}`;
        let deleteNotificationObjectAfterAction = new Request(urlDeleteNotification, {
            headers: {
                'Authorization': `Token ${sessionStorage.getItem(sessionStorage.getItem('username'))}`,
                'X-CSRFToken': csrftoken
            }
        });
        fetch(deleteNotificationObjectAfterAction, {
            method: 'DELETE'
        })
        .catch(error => console.log(error));
        // Get index of the notification to delete
        for (let i = 0; i < friendRequests.length; i++) {
            if (friendRequests[i].id === request.id) {
                var index = i;
            }
        }
        friendRequestCopy.splice(index, 1)
        setFriendRequests(friendRequestCopy);
    }
    return (
        <Container>
            <Container>
                <h1 className="mt-2" style={{fontWeight: 'bolder', textAlign: 'center'}}>Notifications</h1>
                <hr className="mb-3 mt-0" />
            </Container>
            {friendRequests.map(request => (
                <Container className="mt-1" key={request.id}>
                    <h3 className="mt-0 mb-1" style={{fontWeight: 'bold'}}>Friend Request</h3>
                    <div style={{textAlign: 'right'}}>
                        <ButtonGroup aria-label="accept-reject">
                            <Button onClick={() => acceptFriendRequest(request)} variant="dark"><FontAwesomeIcon icon={faCheck} /></Button>
                            <Button onClick={() => declineFriendRequest(request)} variant="dark"><FontAwesomeIcon icon={faTimes} /></Button>
                        </ButtonGroup>
                    </div>
                    <p style={{color: 'grey', fontSize: '18px'}}>{request.frm.username[0].toUpperCase() + request.frm.username.slice(1)} would like to add you as a friend.</p>
                    <hr />
                </Container>
            ))}
            {tripRequests.map(request => (
                <Container>
                    <h1>Trip request from {request.id}</h1>
                    <hr />
                </Container>
            ))}
        </Container>
    )
}