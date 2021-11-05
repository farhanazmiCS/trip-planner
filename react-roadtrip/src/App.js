import React, {useState} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Map
import Map from './components/Map';

// Register and Login Form
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
    setLoginVisibility(loginVisibility === 'block' ? 'none':'block');
  }

  // State of NavBar, toggles between 'none' and 'block'
  const [navbarState, setNavbarState] = useState('none');
  const updateNavbarState = () => {
    setNavbarState(navbarState === 'none' ? 'block':'none');
  }

  // Handle login submit
  const submitForm = (e) => {
    let url = 'http://127.0.0.1:8000/api/login';
    let request = new Request(
      url, {
        headers: {
        'X-CSRFToken': csrftoken
        }
      }
    );
    fetch(request, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
          username: username,
          password: password
      })
    })
    .then(res => res.status)
    .then(status => {
      if (status === 200) {
        updateNavbarState();
        loginFormFunc();
      }
      console.log(status);
    })
    // Prevents reload of page
    e.preventDefault();
  }

  const handleLogout = (e) => {
    let url = 'http://127.0.0.1:8000/api/logout';
    let request = new Request(
      url, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      }
    );
    fetch(request)
    .then((response) => {
      // Update the state of components
      updateNavbarState();
      loginFormFunc();
      showMapVisibility('none');
      setUsername('');
      setPassword('');
      return response;
    })
    .then(res => res.json())
    .then(message => console.log(message));
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
      <NavigationBar state={navbarState} setMapVisibility={showMapVisibility} logoutFunc={handleLogout} />
      <Map state={mapState} />
    </div>
  )
}

export default App;
