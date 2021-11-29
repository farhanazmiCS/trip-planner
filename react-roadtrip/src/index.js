import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CreateTrip from './pages/CreateTrip';
import Login from './pages/Login';
import Register from './pages/Register';

import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import Trips from './pages/Trips';
import Trip from './pages/Trip';

// CSRF cookie function
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="trips" element={<Trips />}>
            <Route path=":tripId" element={<Trip />} />
          </Route>
          <Route path="createtrip" element={<CreateTrip token={getCookie('csrftoken')} />} />
          <Route path="login" element={<Login token={getCookie('csrftoken')} />} />
          <Route path="register" element={<Register token={getCookie('csrftoken')} />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
