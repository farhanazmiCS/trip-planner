import React, {useState, useEffect} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Map
import Map from './components/Map';

// Register and Login Form
import Register from './components/Register';
import Login from './components/Login';

function App() {

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
      />
      <NavigationBar state={navbarState} setMapVisibility={showMapVisibility} />
      <Map state={mapState} />
    </div>
  )
}

export default App;
