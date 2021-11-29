import {Route, Navigate, Routes} from 'react-router-dom';
import {useEffect, useState} from 'react';

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

// To export the trip data
export var tripDataExport = [];

export function getTrip(id) {
    return tripDataExport.find(
        trip => trip.id === id
    );
}

export default function App() {
  const [myTrips, setMyTrips] = useState([]);
  // Function that fetches from endpoint, only once.
  function onLoadOrRefresh() {
    // Retrieves the username, if any, from the session storage
    let user = sessionStorage.getItem('username');
    if (!user) {
      return (
        <Routes>
          <Route render={() => <Navigate to="login" />} />
        </Routes>
      )
    }
    // Defining the url endpoints to fetch auth status and data
    let url = 'http://127.0.0.1/api/login';
    let urlTrips = 'http://127.0.0.1/api/trips';
    // Declare an array to store the requests
    let requests = [];
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
        headers: {
          'Authorization': `Token ${sessionStorage.getItem(user)}`
        }
      }
    })
    // Add to requests array
    requests.push(request);
    requests.push(requestTrips);
    // Fetch auth status
    fetch(requests[0])
    .then(res => res.status)
    .then(status => {
      if (status !== 200) {
        return (
          <Routes>
            <Route render={() => <Navigate to="login" />} />
          </Routes>
        );
      }
      else {
        fetch(requests[1])
        .then(res => res.json())
        .then(body => {
          const trip = body.map(t => {
            return {
              id: t.id,
              name: t.name,
              origin: {
                name: t.origin.text,
                detail: t.origin.place_name,
                dateTimeFrom: formatDateTime(t.origin.dateTimeFrom),
                dateTimeTo: formatDateTime(t.origin.dateTimeTo),
                todo: t.origin.todo.map(t => t.task)
              },
              destination: {
                name: t.destination.text,
                detail: t.destination.place_name,
                dateTimeFrom: formatDateTime(t.destination.dateTimeFrom),
                dateTimeTo: formatDateTime(t.destination.dateTimeTo),
                todo: t.destination.todo.map(t => t.task)
              },
              waypoints: t.waypoint.map(w => {
                return {
                  id: w.id,
                  name: w.text,
                  detail: w.place_name,
                  dateTimeFrom: formatDateTime(w.dateTimeFrom),
                  dateTimeTo: formatDateTime(w.dateTimeTo),
                  todo: w.todo.map(t => t.task)
                }
              }),
            }
          })
          setMyTrips(trip);
          tripDataExport = myTrips;
        })
      }
    })
  }
  useEffect(onLoadOrRefresh, [myTrips]);
  return (
    <Routes>
      <Route render={() => <Navigate to="trips" />} />
    </Routes>
  )
}