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
import FindUsers from './pages/FindUsers';

// Function to format date and time
import { formatDateTime } from './helper';
import todayDateAndTime from './helper';

// FOR CSRF TOKEN: src: https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
  }
  return cookieValue;
}
// Declare CSRF Token
const csrftoken = getCookie('csrftoken');

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

  // Trip state. Stores all the waypoints, for edit trip function. To be passed down to CreateTrip and Trip.
  const [waypoints, setWaypoints] = useState([]);

  // State of fields form register form
  const [emailRegister, setEmailRegister] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [confirmRegister, setConfirmRegister] = useState('');

  // State of error message during register/login/createtrip/edittrip, if any
  const [error, setError] = useState(null);

  // Title and Field Style
  const [title, setTitle] = useState('Trip Name');
  const [titleFieldStyle, setTitleFieldStyle] = useState('border border-dark');
  // Boolean variable that shows or hide the input field for changing the name of the trip.
  const [titleField, setTitleField] = useState(false);
  
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

  // Props for editing trip control (For CreateTrip and Trip components)
  const [show, setShow] = useState(false);
  const [edit, showEdit] = useState(false);
  const [key, setKey] = useState(null);
  const [options, setOptions] = useState([]);
  const [singleOption, setSingleOption] = useState([]);
  // Today date and time
  const [date, now] = todayDateAndTime();
  const defaultDateTime = {
    dateFrom: date,
    timeFrom: now,
    dateTo: date,
    timeTo: now
  }
  const [dateTime, setDateTime] = useState(defaultDateTime);
  // TodoObjects: An array of todos, for each waypoint
  const [todoObjects, setTodoObjects] = useState([]);
  // Waypoint state. Destination or Origin?
  const [waypointType, setWaypointType] = useState({
    isOrigin: false,
    isDestination: false
  });

  // AsyncTypeahead
  // API endpoint and Access Token
  const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  const access_token = 'API_KEY';
  // State declaration for handling location search
  const [isLoading, setIsLoading] = useState(false);
  // Handle location search
  function handleSearch(query) {
    setIsLoading(true);
    fetch(`${endpoint}/${query}.json?limit=10&access_token=${access_token}`)
    .then(response => response.json())
    .then(result => {
      // Contains id, text and place_name
      const features = result['features'];
      return features;
    })
    .then(features => {
      const options = features.map((item) => ({
        id: item.id,
        text: item.text,
        place_name: item.place_name,
        longitude: item.center[0],
        latitude: item.center[1]
      }));
      setOptions(options);
      setIsLoading(false);
    });
  }
  // Returns 'true' to bypass client-side filtering, as results are already filtered by API endpoint.
  const filterBy = () => true;

  /**
   * Function to remove waypoint
   * @param {Number} key
   */
  function removeWaypoint(key) {
    waypoints.splice(key, 1);
    setWaypoints([...waypoints]);
  }

  /**
     * Function that allows the user to add stopover waypoints
     */
  function addStopoverModal() {
    setShow(true);
    setSingleOption([]);
  }
  /**
     * A function that displays the 'edit' modal, along with the waypoint's information
     * @param {Number} key 
     */
  function editModal(key) {
    setShow(true);
    showEdit(true);
    setKey(key);
    setSingleOption([waypoints[key]]);
    setDateTime({
      dateFrom: waypoints[key].dateFrom,
      timeFrom: waypoints[key].timeFrom,
      dateTo: waypoints[key].dateTo,
      timeTo: waypoints[key].timeTo
    })
    setTodoObjects(waypoints[key].todo);
  }

  /**
   * A function that hides the modal and resets the fields
   */
  function hideModal() {
    setShow(false);
    showEdit(false);
    setKey(null);
    setWaypointType({
      isOrigin: false,
      isDestination: false
    })
    setDateTime(defaultDateTime);
    setTodoObjects([]);
  }
  /**
   * Function to add todo items to a waypoint
   */
  function addTodo() {
    setTodoObjects([...todoObjects, '']);
  }

  /**
   * Function to handle change in the todo input field
   * @param {Number} index
   */
  function onTodoChange(e, index) {
    // Set the value to the updated field's value
    todoObjects[index] = e.target.value
    // Update the todoObjects array
    setTodoObjects([...todoObjects]);
  }

  /**
   * Function to remove todo objects from a waypoint
   * @param {Number} key
   */
  function removeTodo(key) {
    todoObjects.splice(key, 1);
    setTodoObjects([...todoObjects]);
  }

  /**
   * Function to add a stopover waypoint
   */
  function addStopover() {
    if (waypoints.find(waypoint => waypoint.type === 'destination' || waypoint.type === 'Destination') === undefined) {
      waypoints.push({
        type: 'stopover',
        dateFrom: dateTime.dateFrom,
        dateTo: dateTime.dateTo,
        timeFrom: dateTime.timeFrom,
        timeTo: dateTime.timeTo,
        text: singleOption[0].text,
        place_name: singleOption[0].place_name,
        todo: todoObjects,
        longitude: singleOption[0].longitude,
        latitude: singleOption[0].latitude
      })
    }
    else if (waypoints.find(waypoint => waypoint.type === 'destination' || waypoint.type === 'Destination') !== undefined) {
      waypoints.splice(waypoints.length - 1, 0, {
        type: 'stopover',
        dateFrom: dateTime.dateFrom,
        dateTo: dateTime.dateTo,
        timeFrom: dateTime.timeFrom,
        timeTo: dateTime.timeTo,
        text: singleOption[0].text,
        place_name: singleOption[0].place_name,
        todo: todoObjects,
        longitude: singleOption[0].longitude,
        latitude: singleOption[0].latitude
      });
    }
    setWaypoints([...waypoints]);
    hideModal();
  }

  /**
   * Function to modify waypoint.
   * @param {Number} key 
   */
  function modifyWaypoint(key) {
    waypoints[key].dateFrom = dateTime.dateFrom;
    waypoints[key].dateTo = dateTime.dateTo;
    waypoints[key].timeFrom = dateTime.timeFrom;
    waypoints[key].timeTo = dateTime.timeTo;
    waypoints[key].todo = todoObjects;
    waypoints[key].text = singleOption[0].text;
    waypoints[key].place_name = singleOption[0].place_name;
    waypoints[key].longitude = singleOption[0].longitude;
    waypoints[key].latitude = singleOption[0].latitude;
    setWaypoints([...waypoints]);
    hideModal();
  }
  /**
   * Function to handle submission of the login form. If response status is 200,
   * saves the username and response token to sessionStorage, and navigates the user to 
   * the '/trips' page.
   * url: endpoint for login.
   * @param {object} e - Event.
   */
  function handleLogin(e) {
    // To clear previous user's session
    let url = 'http://127.0.0.1:8000/api/login';
    let request = new Request(url, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    });
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
  
  /**
   * Function to handle logout. Clears sessionStorage on successful logout.
   * url: endpoint for logging out.
   */
  function handleLogout() {
    // Clear session
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserQuery([]);
    setMyTrips([]);
    setMyFriendRequests([]);
    setMyTripInviteRequests([]);
    setFriendRequests([]);
    setTripRequests([]);
    setUsername('');
    setPassword('');
    navigate('/login');
  }

  /** 
   * Function that is called once the registration form is submitted. Saves the username and user token
   * to sessionStorage if response status is 200.
   * url: endpoint for registering a user.
   * @param {object} e - Event.
   */
  function handleRegister(e) {
    let url = 'http://127.0.0.1:8000/users/register/';
    let request = new Request(url, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    });
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
          setError(null);
        });
        navigate('/trips');
      }
      else {
        response.json().then(body => {
          const error = body['error'];
          console.log(typeof error);
          setError(error);
        })
      }
    })
    e.preventDefault();
  }

  /**
   * Function that defines the urls to fetch and calls the fetchAuthStatus() function.
   * requests: an array that contains all of the request objects.
   * url: endpoint to check user's auth status
   * urlTrips: endpoint to fetch the user's trips
   * urlUsers: endpoint to fetch all users
   * urlNotifications: endpoint to fetch user's notifications
   * urlmyRequestsFriends: endpoint to fetch user's friend requests (made by user)
   * urlMyRequestsTrips: endpoint to fetch user's trip invites (made by user)
   * request: request object for url.
   * requestTrips: request object for urlTrips.
   * requestUsers: request object for urlUsers.
   * requestNotifications: request object for urlNotifications.
   * requestMyRequestsFriends: request object for urlMyRequestsFriends.
   * requestMyRequestsTrips: request object for urlMyRequestsTrips
   */
  function onLoadOrRefresh() {
    // Retrieves the username, if any, from the session storage
    let user = sessionStorage.getItem('username');
    if (!user) return;
    // Defining the url endpoints to fetch auth status, data, users, and notifications
    let url = 'http://127.0.0.1:8000/api/login';
    let urlTrips = 'http://127.0.0.1:8000/trips';
    let urlUsers = 'http://127.0.0.1:8000/users';
    let urlNotifications = 'http://127.0.0.1:8000/notifications';
    let urlMyRequestsFriends = 'http://127.0.0.1:8000/notifications/my_requests_friends';
    let urlMyRequestsTrips = 'http://127.0.0.1:8000/notifications/my_requests_trips';
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
  
  /**
   * Function to fetch the authentication status of the user. If the response status is 200,
   * call the functions that are defined below to fetch the information.
   */
  function fetchAuthStatus() {
    fetch(requests[0])
    .then(res => {
      if (res.status === 200) {
        setIsLoggedIn(true);
        fetchTrips();  // Fetch Trip(s) from endpoint
        fetchUsers(); // Fetch User(s) from endpoint
        fetchNotifications(); // Fetch Notification(s) from endpoint
        fetchMyRequestsFriends(); // Fetch Friend Requests from endpoint
        fetchMyRequestsTrips(); // Fetch Trip Requests from endpoint
      }
      else console.log(res.status);
    })
  }
  
  /**
   * A function that fetches all of the user's trips.
   * trip: maps through the response and sets it into a React Hook, myTrips, as well as into sessionStorage.
   */
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
      // Cache the trips
      let lastTripItem = trip[trip.length - 1];
      // If no trips are cached, cache it. 
      if (sessionStorage.getItem('cached_trips') === null) {
        if (trip.length !== 0) {
          sessionStorage.setItem('cached_trips', JSON.stringify(trip));
        }
      }
      // When a new trip is saved, add it to the cache.
      else if (JSON.parse(sessionStorage.getItem('cached_trips')).find(t => t.id === lastTripItem.id) === undefined) {
        let currentTrips = JSON.parse(sessionStorage.getItem('cached_trips'));
        currentTrips.push(lastTripItem);
        sessionStorage.setItem('cached_trips', JSON.stringify(currentTrips));
      }
    })
  }

  /**
   * A function that fetches all the users and saves them in sessionStorage.
   */
  function fetchUsers() {
    fetch(requests[2])
    .then(res => res.json())
    .then(body => {
      setUsers(body);
      sessionStorage.setItem('users', JSON.stringify(body));
    })
  }

  /**
   * A function that fetches all my notifications, both friend requests and trip invites, and stores them in React Hooks.
   * notifications: A JSON object that contains a list of notification objects.
   * friend_requests: An array that is initialised to store all the friend request notifications
   * trip_invites: An array that is initialised to store all the trip invite notifications
   */
  function fetchNotifications() {
    fetch(requests[3])
    .then(res => res.json())
    .then(body => {
      sessionStorage.setItem('notifications', JSON.stringify(body));
    })
    .then(() => {
      const notifications = JSON.parse(sessionStorage.getItem('notifications'));
      const friend_requests = [];
      const trip_invites = [];
      const notification_array = [];
      notifications.forEach(n => {
        if (n.is_addFriend === true) {
          friend_requests.push(n);
        }
        else {
          trip_invites.push(n);
        }
      })
      notification_array.push(friend_requests, trip_invites);
      return notification_array;
    })
    .then(notification_array => {
      setFriendRequests(notification_array[0]);
      setTripRequests(notification_array[1]);
    })
  }

  /**
   * Function to fetch the friend requests sent by me to other users and save it in a React Hook and sessionStorage
   * myFriendRequests: an array object that stores the friend request objects
   */
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
      sessionStorage.setItem('my_friend_requests', JSON.stringify(myFriendRequests));
    });
  }

  /**
   * Function to fetch the trip requests made by me to other users and saves it in a React Hook and sessionStorage
   * myTripRequests: an array object that stores the request objects.
   */
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
      sessionStorage.setItem('my_trip_requests', JSON.stringify(myTripRequests));
    })
  }
  
  /** 
   * Function to update the title of a trip
   * To be passed down to CreateTrip component
   */
  function updateTitle(e) {
    setTitle(e.target.value);
    setError(null);
  }
  
  // Call the onLoadOrRefresh function once the states of isLoggedIn and tripCounter are changed.
  // eslint-disable-next-line
  useEffect(() => onLoadOrRefresh(), [isLoggedIn, tripCounter]);
  // Closes the title field once on another page
  useEffect(() => {
    setTitleField(false)
    // eslint-disable-next-line
  }, [window.location.href])
  return (
    <>
      {isLoggedIn && <NavigationBar 
        setWaypoints={setWaypoints}
        navigate={navigate}
        user={sessionStorage.getItem('username')} 
        users={users}
        setUsers={setUsers}
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        handleLogout={handleLogout} 
      />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" 
          element={<CreateTrip
            show={show}
            setShow={setShow}
            edit={edit}
            k={key}
            options={options}
            setOptions={setOptions}
            singleOption={singleOption}
            setSingleOption={setSingleOption}
            dateTime={dateTime}
            setDateTime={setDateTime}
            todoObjects={todoObjects}
            setTodoObjects={setTodoObjects}
            editModal={editModal}
            hideModal={hideModal}
            addTodo={addTodo}
            onTodoChange={onTodoChange}
            removeTodo={removeTodo}
            waypointType={waypointType}
            setWaypointType={setWaypointType}
            removeWaypoint={removeWaypoint}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            addStopoverModal={addStopoverModal}
            users={users} 
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
            title={title}
            setTitle={setTitle}
            updateTitle={updateTitle}
            titleFieldStyle={titleFieldStyle}
            setTitleFieldStyle={setTitleFieldStyle}
            titleField={titleField}
            setTitleField={setTitleField}
            addStopover={addStopover}
            modifyWaypoint={modifyWaypoint}
            handleSearch={handleSearch}
            filterBy={filterBy}
            isLoading={isLoading}
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
            show={show}
            setShow={setShow}
            edit={edit}
            k={key}
            options={options}
            setOptions={setOptions}
            singleOption={singleOption}
            setSingleOption={setSingleOption}
            dateTime={dateTime}
            setDateTime={setDateTime}
            todoObjects={todoObjects}
            setTodoObjects={setTodoObjects}
            editModal={editModal}
            hideModal={hideModal}
            addTodo={addTodo}
            onTodoChange={onTodoChange}
            removeTodo={removeTodo}
            waypointType={waypointType}
            setWaypointType={setWaypointType}
            removeWaypoint={removeWaypoint}
            waypoints={waypoints}
            setWaypoints={setWaypoints} 
            addStopoverModal={addStopoverModal}
            myTripInviteRequests={myTripInviteRequests}
            setMyTripInviteRequests={setMyTripInviteRequests}
            titleFieldStyle={titleFieldStyle}
            setTitleFieldStyle={setTitleFieldStyle}
            titleField={titleField}
            setTitleField={setTitleField}
            error={error}
            setError={setError}
            addStopover={addStopover}
            modifyWaypoint={modifyWaypoint}
            handleSearch={handleSearch}
            filterBy={filterBy}
            isLoading={isLoading}
          />} 
        />
        <Route path="/users" 
          element={
            <FindUsers 
              users={users}
              navigate={navigate}
            />
          }
        />
        <Route path="/profile/:userId" 
          element={<Profile 
            users={users} 
            setUsers={setUsers}
            isLoggedIn={isLoggedIn}
            myTrips={myTrips}
            navigate={navigate}
            myFriendRequests={myFriendRequests}
            setMyFriendRequests={setMyFriendRequests}
            setFriendRequests={setFriendRequests} 
            setTripRequests={setTripRequests} 
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
            setTripCounter={setTripCounter}
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