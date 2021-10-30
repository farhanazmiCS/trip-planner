import React, {useState, useEffect} from 'react';

// Navigation Bar
import NavigationBar from './components/NavigationBar';

// Map
import Map from './components/Map';

function App() {
  // Function to display the map once "Create Trip" button is pressed
  const [mapState, setMapState] = useState('none');
  const showMapVisibility = (state) => {
    setMapState(state)
  };
  useEffect(() => {
    console.log(mapState);
  })
  return (
    <div className="home">
      <NavigationBar setMapVisibility={showMapVisibility} />
      <Map mapVisibility={mapState} />
    </div>
  )
}

export default App;
