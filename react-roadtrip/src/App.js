import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import CreateTrip from './pages/CreateTrip';
import Home from './pages/Home';
import Trip from './pages/Trip';
import Register from './pages/Register';
import Login from './pages/Login';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications'

export var myTripsCopy = [];

export default function App() {
  // Redirects
  var navigate = useNavigate();

  // Typeahead search field, only must be an array of one
  const [userQuery, setUserQuery] = useState([]);
  // Typeahead user options
  const [users, setUsers] = useState([]);
  
  // State of username and password fields for login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State of fields form register form
  const [emailRegister, setEmailRegister] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [confirmRegister, setConfirmRegister] = useState('');

  // State of error message during register, if any
  const [error, setError] = useState(null);
  
  // Auth status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // User's trips and counter (used for component lifecycle)
  const [myTrips, setMyTrips] = useState([]);
  const [tripCounter, setTripCounter] = useState(myTrips.length);

  // To store friend requests and trip requests to other users made by me
  const [myFriendRequests, setMyFriendRequests] = useState([]);
  const [myTripInviteRequests, setMyTripInviteRequests] = useState([]);

  // Friend Requests and Trip Requests made from other users to me
  const [friendRequests, setFriendRequests] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  
  // Array to store the requests
  var requests = [];

  // To format the date and time
  function formatDateTime(dateTime) {
    let year = dateTime.slice(0, 4);
    let month = dateTime.slice(5, 7);
    let day = dateTime.slice(8, 10);
    let hour = dateTime.slice(11, 13);
    let minute = dateTime.slice(14, 16);
    if (Number(hour) > 12) {
      var ampm = 'pm';
      hour = Number(hour) - 12;
      return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    else if (Number(hour) === 12) {
      ampm = 'pm';
      return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    ampm = 'am';
    return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
  }
  
  // Handle Login
  function handleLogin(e) {
    // To clear previous user's session
    let url = 'http://127.0.0.1:8000/api/login';
    let request = new Request(url);
    fetch(request, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => {
      if (response.status === 200) {
        setError(null);
        response.json().then(body => {
          const token = body['token'];
          const username = body['username'];
          // Save username and token to sessionStorage
          sessionStorage.setItem(username, token);
          sessionStorage.setItem('username', username);
          // Set isLoggedIn to true
          setIsLoggedIn(true);
          navigate('/trips');
        })
      }
      else {
        response.json().then(body => {
          const error = body['message'];
          setError(error);
        })
      }
    })
    e.preventDefault();
  }
  
  // Function to handle logout
  function handleLogout(e) {
    let url = 'http://127.0.0.1:8000/api/logout';
    let request = new Request(url);
    fetch(request)
    .then(() => {
      // Clear session
      sessionStorage.clear();
      setIsLoggedIn(false);
      setMyTrips([]);
      setMyFriendRequests([]);
      setMyTripInviteRequests([]);
      setFriendRequests([]);
      setTripRequests([]);
      setUsername('');
      setPassword('');
      navigate('/login');
    })
    e.preventDefault();
  }

  // Handle registering
  const handleRegister = (e) => {
    let url = 'http://127.0.0.1:8000/api/register';
    let request = new Request(url);
    fetch(request, {
      method: 'POST',
      body: JSON.stringify({
        email: emailRegister,
        username: usernameRegister,
        password: passwordRegister,
        confirm: confirmRegister
      })
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then(body => {
          sessionStorage.setItem(body['username'], body['token']);
          sessionStorage.setItem('username', body['username']);
          setIsLoggedIn(true);
        });
        navigate('/trips');
      }
      else {
        response.json().then(body => {
          const error = body['error'];
          setError(error);
        })
      }
    })
    e.preventDefault();
  }

  // Function to handle onLoad/onRefresh
  function onLoadOrRefresh() {
    // Retrieves the username, if any, from the session storage
    let user = sessionStorage.getItem('username');
    if (!user) return;
    // Defining the url endpoints to fetch auth status, data, users, and notifications
    let url = 'http://127.0.0.1:8000/api/login';
    let urlTrips = 'http://127.0.0.1:8000/api/trips';
    let urlUsers = 'http://127.0.0.1:8000/api/users';
    let urlNotifications = 'http://127.0.0.1:8000/api/notifications';
    let urlMyRequestsFriends = 'http://127.0.0.1:8000/api/requests/friends';
    let urlMyRequestsTrips = 'http://127.0.0.1:8000/api/requests/trips';
    // Initialize requests (For auth status and data)
    let request = new Request(url, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    // Add to requests array
    requests.push(request);
    let requestTrips = new Request(urlTrips, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    requests.push(requestTrips);
    let requestUsers = new Request(urlUsers, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    requests.push(requestUsers);
    let requestNotifications = new Request(urlNotifications, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    requests.push(requestNotifications);
    let requestMyRequestsFriends = new Request(urlMyRequestsFriends, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    requests.push(requestMyRequestsFriends);
    let requestMyRequestsTrips = new Request(urlMyRequestsTrips, {
      headers: {
        'Authorization': `Token ${sessionStorage.getItem(user)}`
      }
    });
    requests.push(requestMyRequestsTrips);
    // Fetch auth status
    fetchAuthStatus();
  }
  
  // Fetch auth status
  function fetchAuthStatus() {
    fetch(requests[0])
    .then(res => {
      switch(res.status) {
        case 200:
          setIsLoggedIn(true);
          // Fetch Trip(s) from endpoint
          fetchTrips();
          // Fetch User(s) from endpoint
          fetchUsers();
          // Fetch Notification(s) from endpoint
          fetchNotifications();
          // Fetch Friend Requests from endpoint
          fetchMyRequestsFriends();
          // Fetch Trip Requests from endpoint
          fetchMyRequestsTrips();
          break;
        default:
          console.log(res.status);
      }
    })
  }
  
  // Fetch trips
  function fetchTrips() {
    fetch(requests[1])
    .then(res => res.json())
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
            dateTimeFrom: formatDateTime(t.origin.dateTimeFrom),
            dateTimeTo: formatDateTime(t.origin.dateTimeTo),
            todo: t.origin.todo.map(t => t.task)
          },
          destination: {
            role: 'Destination',
            name: t.destination.text,
            detail: t.destination.place_name,
            longitude: t.destination.longitude,
            latitude: t.destination.latitude,
            dateTimeFrom: formatDateTime(t.destination.dateTimeFrom),
            dateTimeTo: formatDateTime(t.destination.dateTimeTo),
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
              dateTimeFrom: formatDateTime(w.dateTimeFrom),
              dateTimeTo: formatDateTime(w.dateTimeTo),
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
      setMyTrips(trip);
      // To export
      myTripsCopy = [...trip];
    })
  }

  // Fetch users
  function fetchUsers() {
    fetch(requests[2])
    .then(res => res.json())
    .then(body => setUsers(body))
  }

  // Fetch notifications
  function fetchNotifications() {
    fetch(requests[3])
    .then(res => res.json())
    .then(body => {
      body.forEach(n => {
        if (n.is_addFriend === true) setFriendRequests([...friendRequests, n]);
        else setTripRequests([...tripRequests, n])
      });
    })
  }

  // Fetch requests made by user
  function fetchMyRequestsFriends() {
    fetch(requests[4])
    .then(res => res.json())
    .then(body => {
      // My friend requests array
      const myFriendRequests = body.map(m => {
        return {
          user: {
            id: m.to.id,
            username: m.to.username
          }
        }
      });
      setMyFriendRequests(myFriendRequests);
    });
  }

  function fetchMyRequestsTrips() {
    fetch(requests[5])
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
    })
  }
  
  // Call the onLoadOrRefresh function once the states of isLoggedIn and tripCounter are changed.
  useEffect(() => onLoadOrRefresh(), [isLoggedIn, tripCounter]);
  return (
    <>
      {isLoggedIn && <NavigationBar 
        navigate={navigate}
        user={sessionStorage.getItem('username')} 
        users={users}
        setUsers={setUsers}
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        handleLogout={handleLogout} 
      />}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
        <Route path="/create-trip" 
          element={<CreateTrip 
            tripCounter={tripCounter}
            setTripCounter={setTripCounter}
            navigate={navigate}
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
            username={username} 
            setUsername={setUsername} 
            password={password} 
            setPassword={setPassword} 
            handleLogin={handleLogin} 
          />} 
        />
        <Route path="/trips" 
          element={<Trips 
            isLoggedIn={isLoggedIn} 
            myTrips={myTrips} 
          />} 
        />
        <Route path="/trips/:tripId" 
          element={<Trip 
            myTrips={myTrips} 
            users={users} 
            myTripInviteRequests={myTripInviteRequests}
            setMyTripInviteRequests={setMyTripInviteRequests}
          />} 
        />
        <Route path="/profile/:userId" 
          element={<Profile 
            users={users} 
            setUsers={setUsers}
            isLoggedIn={isLoggedIn}
            myTrips={myTrips}
            navigate={navigate}
            myFriendRequests={myFriendRequests}
            formatDateTime={formatDateTime}
          />} 
        />
        <Route path="/notifications" 
          element={<Notifications 
            friendRequests={friendRequests} 
            setFriendRequests={setFriendRequests} 
            setTripRequests={setTripRequests} 
            tripRequests={tripRequests} 
            users={users} 
            setUsers={setUsers} 
            setMyTrips={setMyTrips}
            formatDateTime={formatDateTime}
          />} 
        />
        <Route path="/login" 
          element={<Login 
            username={username} 
            password={password} 
            setUsername={setUsername} 
            setPassword={setPassword} 
            handleLogin={handleLogin} 
            setUsernameRegister={setUsernameRegister} 
            setEmailRegister={setEmailRegister} 
            setPasswordRegister={setPasswordRegister} 
            setConfirmRegister={setConfirmRegister} 
            error={error}
            setError={setError}
          />} 
        />
        <Route path="/register" 
          element={<Register 
            username={usernameRegister} 
            setUsername={setUsername} 
            setPassword={setPassword} 
            setUsernameRegister={setUsernameRegister} 
            email={emailRegister} 
            setEmailRegister={setEmailRegister} 
            password={passwordRegister} 
            setPasswordRegister={setPasswordRegister} 
            confirm={confirmRegister} 
            setConfirmRegister={setConfirmRegister} 
            error={error} 
            setError={setError}
            handleRegister={handleRegister} 
          />} 
        />
        <Route path="/logout" element={<Navigate replace to="/login" />} />
        <Route path="*" />
      </Routes>
    </>
  )
}