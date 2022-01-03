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
* The `Login` component renders the login form, containing the password and input fields.
* The __Login__ button, when clicked, calls the `handleLogin` function, a function 'prop' that is property passed down from the parent component `App`.
* The `handleLogin` function takes the form data and sends it to the back-end as JSON payload.
* If the login is successful, the user is directed to the __Trips__ page, if not, an error message will be displayed, informing the user what went wrong.
* The user can also click the sentence below the __Login__ button to create an account if the user does not have one.

#### Register 
* The `Register` component renders the registration form, containing the email, username, password and confirm password fields.
* The __Register__ button, when clicked, calls the `handleRegister` function, which handles the submission of the form data to the backend as JSON payload.
* If the registration is successful, the user is logged in automatically, and is redirected to the __Trips__ page. If not, an error message will be displayed.
* The user can click the sentence below the __Register__ button to be redirected to the login page if the user already has an account.

#### CreateTrip
* The `CreateTrip` component renders the page that allows the user to create a new trip. 
* When this page is loaded, the name of the trip, by default, is set to 'Trip Name'. On the right of it is an edit button, a pencil icon, when clicked or pressed, will change the header to an input field, which allows the user to change the name of the trip.
* Below the name header, a button of content 'Set Origin' is displayed. When the user clicks this button, a __WaypointModal__ component appears, containing a form. In this form, the user can set the parameters of the Origin waypoint, such as location, date and time, and todo items. More information of this modal will be explained in detail in the __Components__ section.
* When the Origin waypoint parameters are set, the user can set the waypoint by pressing the __Set Origin__ button, after which the __Waypoint__ component is rendered within the __CreateTrip__ page. The user can edit the waypoints by pressing the pencil icon displayed on each __Waypoint__ component.
* After setting the origin waypoint, the user will have an option of either setting the destination or adding stopovers. The functionality of pressing one of the two buttons are identical to that of setting the origin waypoint. All the waypoints are editable, but only the stopover points are deletable.
* The user can then save the trip by clicking or pressing the __Save Trip__ button, which will submit the data as JSON to the back-end.

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
