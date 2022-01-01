# RoadTrip
RoadTrip is a web application that let users plan a road trip. 

## Video Demo
[VIDEO DEMO LINK]

## Getting Started

NOTE: Before proceeding, please go through `requirements.md` to install the necessary packages and libraries.
* Firstly, download the [source code](https://github.com/farhanazmiCS/RoadTrip/archive/refs/heads/master.zip).
* Open a terminal window and enter the `capstone` directory by typing `cd capstone`. 
* Open another terminal window, and enter the `react-roadtrip` directory by typing `cd capstone/react-roadtrip`.
* For this application to run, you would need an __access token__ for the MapBox API. You can generate this by signing up for a MapBox account [here](https://account.mapbox.com/auth/signup/).
* Once the token is generated, you can include the token in line 19 of the `CreateTrip.js` file in the `/react-roadtrip/src/pages` directory, then save the file. 
```js ...
const access_token = 'YOUR_ACCESS_TOKEN';
```
* In the `capstone` directory, run `python3 manage.py makemigrations` to run database migrations.
* Afterwards, in the same directory, run `python3 manage.py migrate` to apply the migrations.
* In the `capstone` directory, run `python3 manage.py runserver`. This will host a local server for the backend.
* In the terminal window for the `react-roadtrip` directory, run `npm start`. This will start a React application, which will serve as the client-side code.

At this point, you're all set! You can now proceed to `http://localhost:3000` (the default host and port) to use this web application.

## After Setting Up

Listed below are the functions and components of the web application necessary for it to function, for both the client
and server-side.

### Pages (JavaScript - React)

The following items are the "pages" of the web application. They are ultimately React components.

* Login
* Register
* CreateTrip
* Trips
* Trip
* Profile
* Notifications

#### Login
[TODO]

#### Register 
[TODO]

#### CreateTrip
[TODO]

#### Trips
[TODO]

#### Trip
[TODO]

#### Profile 
[TODO]

#### Notifications 
[TODO]

### Components (JavaScript - React)

The following items are the "components" of the React portion of the web application.
They are utilised by the "pages".

* NavigationBar
* Todo
* Waypoint
* WaypointModal

### BackEnd (Django-REST Framework)

The backend is utilised solely as an API, and does not perform the rendering. Django-REST Framework (DRF) was utilised
for developing views based on database models, using the Create, Read, Update and Delete (CRUD) principle to handle 
the data. In addition, DRF was also used as serialization of data into JavaScript Object Notation (JSON) was made 
simpler.

To be continued...
