# RoadTrip
RoadTrip is a web application that let users plan a road trip. 

## App Demo
You can try the app yourself [here](https://roadtrip-react-frontend.herokuapp.com/login)!

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
* If the registration is successful, the user is logged in automatically and is then redirected to the __Trips__ page. If not, an error message will be displayed.
* The user can click the sentence below the __Register__ button to be redirected to the login page if the user already has an account.

#### CreateTrip
* The `CreateTrip` component renders the page that allows the user to create a new trip. 
* When this page is loaded, the name of the trip, by default, is set to 'Trip Name'. On the right of it is an edit button, a pencil icon, when clicked or pressed, will change the header to an input field, allowing the user to change the name of the trip.
* Below the name header, a button of content __Set Origin__ is displayed. When the user clicks this button, a __WaypointModal__ component appears, containing a form. In this form, the user can set the parameters of the Origin waypoint, such as location, date and time, and todo items. More information of this modal will be explained in detail in the __Components__ section.
* When the Origin waypoint parameters are set, the user can set the waypoint by pressing the __Set Origin__ button, after which the __Waypoint__ component is rendered within the __CreateTrip__ page. The user can edit the waypoints by pressing the pencil icon displayed on each __Waypoint__ component.
* After setting the origin waypoint, the user will have an option of either setting the destination or adding stopovers. The functionality of pressing the __Add Stopover__ or __Set Destination__ buttons are identical to that of setting the origin waypoint. All the waypoints are editable, but only the stopover points are deletable.
* The user can then save the trip by clicking or pressing the __Save Trip__ button, which will submit the data as JSON to the back-end for processing. If successful, the user will be redirected back to the __Trips__ page, with the new trip being displayed in the page.

#### Trips
* The `Trips` component renders the page that displays all of the user's trips.
* The user can click or press any of the trips to view more information of the trip, which will direct them to the __Trip__ page.

#### Trip
* The `Trip` component renders the page that displays information about a particular trip.
* Information such as the __Trip Name__, __Origin__ waypoint, __Stopover__ waypoints, __Destination__ waypoints as well as their associated data are displayed in this page.
* If the user is in the trip that he or she is viewing, the user can invite friends into the trip by clicking or pressing the __Invite Friends__ button located at the top right corner of the page. 

#### Profile 
* The `Profile` component renders the page that displays information about a queried user.
* In this page, the __username__ of the user is displayed at the top middle. Below it displays the __trip count (shown as Trips)__ and __friend count (shown as Friends)__.
* A button is displayed in this page, below the __Trips__ and __Friends__ header. Depending on the condition, the content and type of button may vary:
 1. When __user2__ (logged-on user) is not a friend of __user1__ (profile being viewed), and a friend request has __not__ been sent
 <div align="center">
    <img width="337" alt="NoRequestNotFriend" src="https://user-images.githubusercontent.com/68798786/148003558-03ef2cc9-160a-44ab-be4b-baa66c33560e.png">
 </div>
 <br />
 
 2. When __user2__ is not a friend of __user1__, friend request has been sent
 <div align="center">
    <img width="339" alt="RequestedNotFriend" src="https://user-images.githubusercontent.com/68798786/148003902-ba72a214-0f86-4530-8bb1-d83668958d71.png">
 </div>
 <br />
 
 3. __user2__ is a friend of __user1__. In addition to the button change, the __friend count__ (Displayed as Friends) is updated. __user1's__ trips are also displayed, which allows __user2__ to view them.
 <div align="center">
    <img width="338" alt="IsFriend" src="https://user-images.githubusercontent.com/68798786/148004162-9039675d-3121-483c-847c-4f13e1d2d7f9.png">
 </div>
 <br />
 
#### Notifications 
* The `Notifications` component renders the page that displays notifications from other users.
* The user may receive two different types of notifications, a __trip invite__ or a __friend request__.
* For every notification, the user can opt to accept or decline a notification by pressing the __Accept/Decline__ button, like the one shown below.
 <div align="center">
    <img width="338" alt="requestfriend" src="https://user-images.githubusercontent.com/68798786/148169163-32a1791f-bc05-4dcc-9d93-2b5699a327b4.png">
 </div>
 <br />


### Components (JavaScript - React)

The following items are the "components" of the React portion of the web application.
They are utilised by the "pages".

* NavigationBar
* Todo
* Waypoint
* WaypointModal

#### NavigationBar
* The `NavigationBar` component renders the navigation bar at the top of the page when the user is logged in.
* The navigation bar can be used to navigate through the web application, such as:

  1. __Trips__ page
  2. __Create Trip__ page
  3. __My Profile__ page
  4. __Notifications__ page
  5. __My Profile__ page
  6. __Logout__ button

#### Todo
* `Todo` component is a form input field that is part of the `WaypointModal` component, used for the user to add todo items in every waypoint object.
* The user can add as many todo items as they desire, as demonstrated in the gif below:
 <div align="center">
   <img width="250" src="https://user-images.githubusercontent.com/68798786/148171801-8cf78174-65a1-48ef-9e73-f215fcde0314.gif" alt="todo">
 </div>
 <br />
 
#### Waypoint
* The `Waypoint` component is used to display the information of a particular waypoint.
* Information such as location, date and time, and todo items are displayed in this component.
* It is rendered using a __Card__ component as defined in the React-Bootstrap library.

#### WaypointModal
* The `WaypointModal` component displays a bootstrap modal component when the user presses or clicks the __Set Origin/Add Stopover/Set Destination__ button in the __CreateTrip__ page.
* In the modal contains a form containing input fields that allows the user to query for a specific location, set the date and time period of the waypoint, and add todo items.
* The user can then press the __Set Origin/Add Stopover/Set Waypoint__ button at the bottom of the modal to complete the form.

### Backend (Django-REST Framework)

The backend utilises Django-REST Framework, a Django extension used to develop a Representational State Transfer (REST) API. The backend does not perform any rendering of the data into HTML, but handles the data, serializes them into JSON and providing a response back to the client.

There are several parts in the backend that needs to be discussed, namely:
- Views
- Models
- Serialization

#### Views
The views in the backend are contained in the `views.py` file, which contain several class-based views. Listed below are the views, as well as their associated methods:
- `TripViewSet`
  - __list:__ Lists all the logged-on user's trips.
  - __listOther:__ Lists the trips of a user, given a key (user id) as a parameter.
  - __retrieve:__ Retrieve a particular trip, given a key (trip id) as a parameter.
  - __create:__ Create a new trip object.
  - __addFriendToTrip:__ Add a user object to the __users__ key in a trip object.

- `WaypointViewSet`
  - __retrieve:__ Retrieve a waypoint object, given a key (waypoind id) as a parameter.

- `TodoViewSet`
  - __retrieve:__ Retrieve a todo object, given a key (todo id) as a parameter.

- `NotificationViewSet`
  - __list:__ List all the logged-on user's notifications (Friend requests and trip invites made by other users to the logged-on user).
  - __listRequestsMadeByMe_friend_request:__ Lists all the friend request notifications that originate from the logged-on user.
  - __listRequestsMadeByMe_trip_request:__ Lists all the trip invite notifications that originate from the logged-on user.
  - __create:__ Create a new notification object, originating from the logged-on user.
  - __delete:__ Delete a notification object. Used when a user accepts or declines a request.

- `LoginView`
  - __get:__ When a client requests this endpoint with the appropriate authorization headers, the API will provide a response code of `200`. If there are no authorization headers present, `request.user` will return `None` and will return a HTTP status of `400`.
  - __post:__ Takes the login form and processes it. Returns a user object if matching credentials found, else returns `404` if no user found with the queried username, or `401` if the password is incorrect.

- `LogoutView`
  - __get:__ Calls the `logout()` function and logs the user out.

#### Models
[TODO]

#### Serialization
[TODO]

#### URL routing
[TODO]
