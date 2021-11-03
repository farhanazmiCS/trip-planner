import React, {useState, useEffect} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Map
import Map from './components/Map';

// Register and Login Form
import Register from './components/Register';
import Login from './components/Login';

function App() {

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
  // Initialize CSRF Token
  const csrftoken = getCookie('csrftoken');

  // State of username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State of map, can set to 
  const [mapState, setMapState] = useState('none');
  const showMapVisibility = (state) => {
    setMapState(state);
  };

  // State of login form, toggles between 'none' and 'block'
  const [loginVisibility, setLoginVisibility] = useState('block');
  const loginFormFunc = () => {
    setLoginVisibility(loginVisibility ? 'none':'block');
  }

  // State of NavBar, toggles between 'none' and 'block'
  const [navbarState, setNavbarState] = useState('none');
  const updateNavbarState = () => {
    setNavbarState(navbarState ? 'none':'block');
  }

  // Handle login submit
  const submitForm = (e) => {
    let url = 'http://127.0.0.1:8000/api/login';
    let request = new Request(
      url, {
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
    .then(res => {
      console.log(res.status);
    })
    e.preventDefault();
  }
  return (
    // Login component properties:
    // state => visibility state of the login "page"
    // value => values of the username and password fields
    // updaterFunc => functions to update the state of the username and password fields
    <div className="home">
      <Login
        props={{
          state: loginVisibility,
          username: username,
          password: password,
        }}
        updateUsername={setUsername}
        updatePassword={setPassword}
        submitForm={submitForm}
      />
      <NavigationBar state={navbarState} setMapVisibility={showMapVisibility} />
      <Map state={mapState} />
    </div>
  )
}

export default App;
