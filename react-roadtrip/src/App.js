import React, {useState, useEffect} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Login Form
import Login from './pages/Login';

// Register Form
import Register from './pages/Register';

// Create Trip "Page"
import CreateTrip from './pages/CreateTrip';

// View Trips "Page"
import Trips from './pages/Trips';

// Trip
import Trip from './pages/Trip';

// Get CSRF cookie
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
// Initialize CSRF Token
const csrftoken = getCookie('csrftoken');

function App() {
  // State of username and password (for login form)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // View Trip Index Key
  const [key, setKey] = useState(null);

  // State of username, password and confirm (for register form)
  const [emailRegister, setEmailRegister] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [confirmRegister, setConfirmRegister] = useState('');

  // State of error message
  const [error, setError] = useState(null);

  // State of map
  const [mapState, setMapState] = useState(false);
  const showMapVisibility = () => setMapState(true);
  const hideMapVisibility = () => setMapState(false);

  // State of login form
  const [loginVisibility, setLoginVisibility] = useState(false);
  const updateLoginform = () => setLoginVisibility(!loginVisibility);

  // State of register form
  const [registerVisibility, setRegisterVisibility] = useState(false);
  const updateRegisterform = () => setRegisterVisibility(!registerVisibility);

  // State of NavBar, toggles between 'none' and 'block'
  const [navbarState, setNavbarState] = useState(false);
  const updateNavbar = () => setNavbarState(!navbarState);

  // Specific trip state
  const [trip, setTrip] = useState(false);
  const showTrip = () => setTrip(true);
  const hideTrip = () => setTrip(false);

  // Create Trip "page" state and handling it's visibility
  const [createTripState, setCreateTripState] = useState(false);
  const showCreateTrip = () => {
    setCreateTripState(true);
    hideMapVisibility();
    hideTrip();
  }
  const hideCreateTrip = () => setCreateTripState(false);

  // View Trips "page" state and handling it's visibility
  const [viewTripState, setViewTripState] = useState(false);
  const showViewTrip = () => {
    setViewTripState(true);
    hideMapVisibility();
    hideTrip();
  }
  const hideViewTrip = () => setViewTripState(false);

  // Toggle between Register and Login views
  const toggleRegisterLogin = () => {
    updateLoginform();
    updateRegisterform();
  }

  // To view specific trip
  const viewSpecificTrip = (key) => {
    hideViewTrip();
    showTrip();
    showMapVisibility();
    setKey(key);
  }

  // Handle registering
  const handleRegister = (e) => {
    let url = 'http://127.0.0.1:8000/api/register';
    let request = new Request(url, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    });
    fetch(request, {
      method: 'POST',
      mode: 'cors',
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
        });
        // Update UI
        updateRegisterform();
        updateNavbar();
        showViewTrip();
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

  // Handle login form submission
  const handleLogin = (e) => {
    let url = 'http://127.0.0.1:8000/api/login';
    let request = new Request(url, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    });
    fetch(request, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
          username: username,
          password: password
      })
    })
    .then(response => response.json())
    .then(content => {
      if (content.status !== 200) {
        console.log(content.message);
        return;
      }
      const token = content['token'];
      const username = content['username'];
      // Update UI
      updateNavbar();
      updateLoginform();
      showViewTrip();
      // Save username and token to sessionStorage
      sessionStorage.setItem(username, token);
      sessionStorage.setItem('username', username);
    })
    e.preventDefault();
  }

  // Handle session logout
  const handleLogout = (e) => {
    let url = 'http://127.0.0.1:8000/api/logout';
    let request = new Request(url);
    fetch(request)
    .then((response) => {
      // Update the state of components
      updateNavbar();
      updateLoginform();
      hideMapVisibility();
      hideCreateTrip();
      hideViewTrip();
      hideTrip();
      // Empty the fields
      setUsername('');
      setPassword('');
      // Clear sessionStorage
      sessionStorage.clear();
      // Pass response to next promise
      return response;
    })
    .then(res => res.json())
    .then(message => console.log(message));
    e.preventDefault();
  }

  const formatDateTime = (dateTime) => {
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

  // Trip data (in array format)
  const [myTrips, setMyTrips] = useState([]);

  // On page refresh (user is authenticated)
  const onRefresh = () => {
    let user = sessionStorage.getItem('username')
    if (user) {
      let url = 'http://127.0.0.1:8000/api/login'
      let urlTrips = 'http://127.0.0.1:8000/api/trips/'
      let request = new Request(url, {
        headers: {
          'Authorization': `Token ${sessionStorage.getItem(user)}`,
        }
      });
      let requestTrips = new Request(urlTrips, {
        headers: {
          'Authorization': `Token ${sessionStorage.getItem(user)}`
        }
      });
      fetch(request)
      .then(response => response.status)
      .then(status => {
        if (status === 200) {
          // Fetch data
          fetch(requestTrips)
          .then(response => response.json())
          .then(body => {
            const t = body.map(trip => {
              return {
                id: trip.id,
                name: trip.name,
                origin: {
                  name: trip.origin.text,
                  detail: trip.origin.place_name,
                  dateTimeFrom: formatDateTime(trip.origin.dateTimeFrom),
                  dateTimeTo: formatDateTime(trip.origin.dateTimeTo),
                  todo: trip.origin.todo.map(t => t.task)
                },
                destination: {
                  name: trip.destination.text,
                  detail: trip.destination.place_name,
                  dateTimeFrom: formatDateTime(trip.destination.dateTimeFrom),
                  dateTimeTo: formatDateTime(trip.destination.dateTimeTo),
                  todo: trip.destination.todo.map(t => t.task)
                },
                waypoints: trip.waypoint.map(w => {
                  return {
                    id: w.id,
                    name: w.text,
                    detail: w.place_name,
                    dateTimeFrom: formatDateTime(w.dateTimeFrom),
                    dateTimeTo: formatDateTime(w.dateTimeTo),
                    todo: w.todo.map(t => t.task)
                  }
                }),
                users: trip.users
              }
            })
            setMyTrips(t);
          })
          // Update UI 
          updateNavbar();
          showViewTrip();
      }
        else console.log(status);
      })
    }
    else{
      updateLoginform();
    }
  }

  useEffect(onRefresh, []);

  return (
    // Login component properties:
    // state => visibility state of the login "page"
    // value => values of the username and password fields
    // updaterFunc => functions to update the state of the username and password fields
    <div className="home">
      { registerVisibility ? <Register 
        redirectToLogin={toggleRegisterLogin}
        handleRegister={handleRegister}
        email={emailRegister}
        username={usernameRegister}
        password={passwordRegister}
        confirm={confirmRegister}
        setEmail={setEmailRegister}
        setUsername={setUsernameRegister}
        setPassword={setPasswordRegister}
        setConfirm={setConfirmRegister}
        error={error}
        /> : null }
      { loginVisibility ? <Login
        props={{
          username: username,
          password: password,
        }}
        updateUsername={setUsername}
        updatePassword={setPassword}
        submitForm={handleLogin}
        redirectToRegister={toggleRegisterLogin}
      /> : null }
      { navbarState ? <NavigationBar 
        state={navbarState} 
        showCreateTrip={showCreateTrip} 
        hideCreateTrip={hideCreateTrip}
        showViewTrip={showViewTrip}
        hideViewTrip={hideViewTrip}
        logoutFunc={handleLogout}
        username={sessionStorage.getItem('username')} 
      /> : null }
      { viewTripState && <Trips myTrips={myTrips} viewSpecificTrip={viewSpecificTrip} /> }
      { createTripState && <CreateTrip token={csrftoken} /> }
      { trip && <Trip trip={myTrips[key]} mapState={mapState} /> }
    </div>
  )
}

export default App;
