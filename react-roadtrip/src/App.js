import React, {useState, useEffect} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Map
import Map from './components/Map';

// Login Form
import Login from './components/Login';

// Register Form
import Register from './components/Register';

// Create Trip "Page"
import CreateTrip from './pages/CreateTrip';

// View Trips "Page"
import ViewTrip from './pages/ViewTrip';

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

  // State of username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State of map
  const [mapState, setMapState] = useState('none');
  const showMapVisibility = (state) => {
    setMapState(state);
  };

  // State of login form
  const [loginVisibility, setLoginVisibility] = useState(false);
  const updateLoginform = () => {
    setLoginVisibility(!loginVisibility);
  }

  // State of register form
  const [registerVisibility, setRegisterVisibility] = useState(false);
  const updateRegisterform = () => {
    setRegisterVisibility(!registerVisibility);
  }

  // State of NavBar, toggles between 'none' and 'block'
  const [navbarState, setNavbarState] = useState(false);
  const updateNavbar = () => {
    setNavbarState(!navbarState);
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
        return
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
      showMapVisibility('none');
      hideCreateTrip();
      hideViewTrip();
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

  // Create Trip "page" state and handling it's visibility
  const [createTripState, setCreateTripState] = useState(false);
  const showCreateTrip = () => {
    setCreateTripState(true);
  }
  const hideCreateTrip = () => {
    setCreateTripState(false);
  }

  // View Trips "page" state and handling it's visibility
  const [viewTripState, setViewTripState] = useState(false);
  const showViewTrip = () => {
    setViewTripState(true);
  }
  const hideViewTrip = () => {
    setViewTripState(false);
  }

  // On page refresh (user is authenticated)
  const onRefresh = () => {
    let user = sessionStorage.getItem('username')
    if (user) {
      let url = 'http://127.0.0.1:8000/api/login'
      let request = new Request(url, {
        headers: {
          'Authorization': `Token ${sessionStorage.getItem(user)}`,
        }
      });
      fetch(request)
      .then(response => response.status)
      .then(status => {
        if (status === 200) {
          // Update UI
          updateNavbar();
          showViewTrip();
        }
        else {
          console.log(status);
        }
      });
    }
    else{
      updateLoginform();
    }
  }

  const toggleRegisterLogin = () => {
    updateLoginform();
    updateRegisterform();
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
        /> : null}
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
      /> : null }
      { viewTripState && <ViewTrip /> }
      { createTripState && <CreateTrip />}
      <Map 
        state={mapState} 
      />
    </div>
  )
}

export default App;
